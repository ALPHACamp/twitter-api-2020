const { emitError, findUserInPublic } = require("../helper")
const readEvent = require("./read")
const { Notice } = require("../../models")
const updateRoom = require("./updateRoom")

module.exports = async (io, socket) => {
  try {
    // find user
    const user = findUserInPublic(socket.id, "socketId")

    // not in room
    if (!user.currentRoom) throw new Error("You are not currently in a room")

    // read again before leave
    if (user.currentRoom === "notice") {
      // currentRoom = 通知
      const notice = await Notice.findOne({ where: { userId: user.id } })
      if (!notice) throw new Error("離開通知房間時找不到Notice record!")
      await notice.update({
        noticeRead: new Date(),
      })
    } else {
      // currentRoom = 私人房間
      await readEvent(socket, user.currentRoom, user.id)
    }

    // 告知使用者
    socket.emit(
      "server-leave-room",
      `User ${user.id} left room ${user.currentRoom}`
    )

    // leave room
    const lastRoom = user.currentRoom
    user.currentRoom = ""

    // 告知房間裡的其他使用者
    await updateRoom(io, socket, lastRoom, `${user.name} 離開房間`)

    // 測試用
    console.log("leaveRoom:", user)
  } catch (err) {
    emitError(socket, err)
  }
}
