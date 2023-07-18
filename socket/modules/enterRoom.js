const { emitError, findUserInPublic, getAllRooms } = require('../helper')
const readEvent = require('./read.js')
const leaveRoom = require('./leaveRoom')
const { Notice } = require('../../models')

module.exports = async (socket, roomId) => {
  try {
    // 這功能不會用來建立新的房間，使用者需要先 getRoom 成功建立房間
    // 之後才能 enterRoom
    // public room: 不需要使用 enter-room
    // notice room: 需要使用 enter-room

    // check user Id
    const user = findUserInPublic(socket.id, 'socketId')

    // 重複進入同個房間就不觸發
    if (user.currentRoom === roomId) return

    if (roomId === 'notice') {
      // currentRoom = 通知

      // 更新 Notice noticeRead
      let notice = await Notice.findOne({ where: { userId: user.id } })

      // Notice 不存在就建立一個
      if (!notice) {
        notice = await Notice.create({
          userId: user.id,
          newNotice: new Date(),
          noticeRead: new Date()
        })
        console.log('建立一個新的 notice record')
      }
      // 更新 Notice
      await notice.update({ noticeRead: new Date() })
      console.log('更新 noticeRead 時間')
    } else {
      // currentRoom = 私人房間

      // if user belong to that room
      const rooms = await getAllRooms(user.id)
      const hasRoom = rooms.some(room => room === roomId)
      if (!hasRoom) throw new Error('You do not have that room, use getRoom first')
      // read
      readEvent(socket, roomId, user.id)
    }

    // 離開上一個房間
    if (user.currentRoom && user.currentRoom !== roomId) {
      await leaveRoom(socket)
    }

    // 建立使用者的 currentRoom
    user.currentRoom = roomId
    // 告知使用者
    socket.emit('server-enter-room', `User ${user.id} enter room ${roomId}`)

    // 測試用
    console.log('enterRoom:', user)
  } catch (err) {
    emitError(socket, err)
  }
}
