const { userExistInDB, hasMessage, findUserInPublic, filterUsersInPublic, emitError } = require('../helper')
const { Chat, Room } = require('../../models')
const newMessageEvent = require('../modules/newMessage')
const read = require('./read')

// 公開訊息與私人訊息之後會使用 room 參數判斷
module.exports = async (io, socket, message, timestamp, roomId) => {
  try {
    // 避免資料庫跳號問題，先找出public room id
    const publicRoom = await Room.findOne({ attributes: ['id'], raw: true })
    // default
    const room = roomId || publicRoom.id
    const time = timestamp || new Date()

    // 檢查 聊天室存在
    const roomRecord = await Room.findOne({ where: { id: room } })
    if (!roomRecord) throw new Error('此聊天室不存在!')

    // 檢查 使用者存在
    const currentUser = findUserInPublic(socket.id, 'socketId')

    const userId = currentUser.id
    const user = await userExistInDB(userId, 'id')

    // 使用者必須 enter-room 才能傳送訊息
    if (!currentUser.currentRoom &&
      room !== publicRoom.id) throw new Error('使用者必須enter-room才能傳送訊息')

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
