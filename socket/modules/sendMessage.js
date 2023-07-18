const { userExistInDB, hasMessage, findUserInPublic, filterUsersInPublic, emitError } = require('../helper')
const { Chat, Room } = require('../../models')
const newMessageEvent = require('../modules/newMessage')
const read = require('./read')

// 公開訊息與私人訊息之後會使用 room 參數判斷
module.exports = async (io, socket, message, timestamp, roomId) => {
  try {
    // 避免使用 'notice' 房間
    if (roomId === 'notice') {
      throw new Error(`不能使用 ${roomId} 當成房間參數 `)
    }

    // 檢查 使用者存在
    const currentUser = findUserInPublic(socket.id, 'socketId')
    const userId = currentUser.id
    const user = await userExistInDB(userId, 'id')
    const currentRoom = currentUser.currentRoom

    // 避免在 'notice' 房間內傳訊息
    if (currentUser.currentRoom === 'notice') {
      throw new Error(`不能在這房間內使用client-message, 目前房間為 ${currentUser.currentRoom}`)
    }

    // 避免資料庫跳號問題，先找出public room id
    const publicRoom = await Room.findOne({ attributes: ['id'], raw: true })
    // default
    const room = roomId || publicRoom.id
    const time = timestamp || new Date()

    // 使用者必須 enter-room 才能傳送訊息
    if (!currentUser.currentRoom &&
      room !== publicRoom.id) throw new Error('使用者必須enter-room才能傳送訊息')

    // 使用者的 currentRoom 跟訊息傳遞的 roomId 要一樣
    // (這之後刪掉，改成不需要使用roomId，直接用currentRoom 觸發)
    console.log('currentRoom:', currentRoom, 'roomId:', roomId)
    if (currentUser.currentRoom !== roomId) throw new Error(`使用者必須在當前房間必須與要傳遞訊息的房間一樣 currentRoom: ${currentUser.currentRoom} roomId: ${roomId}`)

    // 檢查 聊天室存在
    const roomRecord = await Room.findOne({ where: { id: room } })
    if (!roomRecord) throw new Error('此聊天室不存在!')

    // 檢查有沒有訊息 (同時用trim)
    const trimmedMessage = hasMessage(message)

    // 回傳資訊
    const msgPackage = {
      user,
      message: trimmedMessage,
      timestamp: time,
      room
    }
    // 傳遞
    if (room.toString() === publicRoom.id.toString()) {
      // 公開訊息
      socket.broadcast.emit('server-message', msgPackage)
    } else {
      // 一對一訊息
      socket.to(room).emit('server-message', msgPackage)

      // 每個在房間內的使用者 觸發read
      const usersInRoom = filterUsersInPublic(currentUser.currentRoom, 'currentRoom')
      usersInRoom.forEach(inRoomUser => {
        read(socket, roomId, inRoomUser.id)
      })
      // 每個在房間內的使用者 觸發newMessage
      usersInRoom.forEach(async user => {
        const userSocket = io.sockets.sockets.get(user.socketId)
        await newMessageEvent(userSocket)
      })
    }
    // 儲存訊息至DB
    await Chat.create({
      message: trimmedMessage,
      userId: user.id,
      roomId: room,
      timestamp: time
    })
  } catch (err) {
    emitError(socket, err)
  }
}
