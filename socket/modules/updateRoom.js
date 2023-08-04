const { emitError, filterUsersInPublic } = require("../helper")
const readEvent = require("./read.js")
const leaveRoom = require("./leaveRoom")
const { Notice } = require("../../models")

// 目前房間內的使用者
// return string (更新訊息) array (在房間內的使用者)
module.exports = async (io,socket, roomId, message) => {
  try {
    console.log('starting updateRoom')

    // if roomId is notice or public
    if (roomId === "notice" || roomId === "public") return
    // if no roomId
    if (roomId === undefined)
      throw new Error("update-room error: roomId is undefined")

    // get users in room
    const users = filterUsersInPublic(roomId, "currentRoom")

    console.log('users in the room:', users)

    const updateObject = {
      message,
      users,
    }

    // send update-room to each users in room
    await Promise.all(
      users.map(async (user) => {
        const socket = await io.sockets.sockets.get(user.socketId)
        socket.emit("server-update-room", updateObject)
      })
    )
    console.log(`updateRoom ${roomId} to ${users.length} users, `)
  } catch (err) {
    emitError(socket, err)
  }
}
