const {
  userExistInDB,
  hasMessage,
  findUserInPublic,
  filterUsersInPublic,
  emitError
} = require('../helper')
const { Chat, Room } = require('../../models')
const newMessageEvent = require('../modules/newMessage')
const read = require('./read')

// 公開訊息與私人訊息之後會使用 room 參數判斷
module.exports = async (io, socket, message, timestamp) => {
  try {
    // 檢查 使用者存在
    const currentUser = findUserInPublic(socket.id, 'socketId')
    const userId = currentUser.id
    const user = await userExistInDB(userId, 'id')
    const currentRoom = currentUser.currentRoom

    // 避免在 'notice' 房間內傳訊息
    if (currentUser.currentRoom === 'notice') {
      throw new Error(
        `不能在這房間內使用client-message, 目前房間為 ${currentUser.currentRoom}`
      )
    }

    // 避免資料庫跳號問題，先找出public room id
    const publicRoom = await Room.findOne({ attributes: ['id'], raw: true })
    // default
    const room = currentRoom === undefined ? publicRoom.id : currentRoom
    const time = timestamp || new Date()

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

    // 儲存訊息至DB
    await Chat.create({
      message: trimmedMessage,
      userId: user.id,
      roomId: room,
      timestamp: time
    })

    // 傳遞
    if (room.toString() === publicRoom.id.toString()) {
      // 公開訊息
      socket.broadcast.emit('server-message', msgPackage)
    } else {
      // 一對一訊息
      socket.to(room).emit('server-message', msgPackage)

      // 每個在房間內的使用者 觸發read
      const usersInRoom = filterUsersInPublic(currentRoom, 'currentRoom')

      await Promise.all(usersInRoom.map(async inRoomUser => {
        await read(socket, currentRoom, inRoomUser.id)
      }))

      // 每個房間的擁有者 觸發newMessage
      const roomOwnersIds = [roomRecord.userOneId, roomRecord.userTwoId]

      await Promise.all(roomOwnersIds.map(async id => {
        const user = findUserInPublic(id, 'id', false)
        if (user?.socketId) {
          const socket = io.sockets.sockets.get(user.socketId)
          await newMessageEvent(socket)
        }
      }))
    }
  } catch (err) {
    emitError(socket, err)
  }
}
