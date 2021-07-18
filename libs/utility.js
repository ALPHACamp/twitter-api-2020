module.exports = {
  generateRoomName: (id, listenerId) => {
    if (!id || !listenerId) {
      throw new Error('id or listener missed')
    }

    let roomName = ''

    const sorts = [id, listenerId]
    sorts.sort((a, b) => {
      return a - b
    })

    roomName = sorts.join('n')

    return roomName
  },

  SearchListenerOnline: (io, socketNow, listenerId) => {
    for (let [id, socket] of io.of('/').sockets) {
      if (clients.has(id) && socket.data.id === listenerId) {
        return {
          isOnline: true,
          listenerSocketId: id
        }
      }
    }
    return {
      isOnline: false,
      listenerSocketId: null
    }
  },

  checkIsInRoom: (io, socket, listenerId) => {
    const usersInRoom = []
    for (let [id, socket] of io.of('/').sockets) {
      const userId = socket.data.id
      if (clients.has(id)) {
        usersInRoom.push(userId)
      }
      if (usersInRoom.includes(listenerId)) {
        return true
      }
    }
  },
}