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

  SearchListenerOnline: (io, socket, clients, listenerId) => {
    for (let [id, socket] of io.of('/').sockets) {
      console.log(`socketId:${id}, id:${socket.data.id} `)
      if (socket.data.id === listenerId) {
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

  checkIsInRoom: (io, socket, clients, listenerSocketId) => {
    for (let [id, socket] of io.of('/').sockets) {
      console.log(`socketId:${id}, id:${socket.data.id} `)
      if (clients.has(listenerSocketId)) {
        return true
      }
    }
  },
}