module.exports = {
  generateRoomName: (id, listenerId) => {
    if (!id || !listenerId) {
      throw new Error('id or listener missed')
    }

    const sorts = [id, listenerId]
    sorts.sort((a, b) => {
      return a - b
    })

    const roomName = sorts.join('n')
    return roomName
  },

  SearchListenerOnline: (io, socket, clients, listenerId) => {
    const listenerSocketIds = []
    for (let [socketId, socket] of io.of('/').sockets) {
      console.log(`at SearchListenerOnline, socketId:${socketId}, id:${socket.data.id} `)
      if (socket.data.id === listenerId) {
        listenerSocketIds.push(socketId)
      }
    }
    console.log('==listenerSocketIds==', listenerSocketIds)

    return listenerSocketIds.length > 0 ? {
      isOnline: true,
      listenerSocketIds: listenerSocketIds
    } : {
      isOnline: false,
      listenerSocketIds: []
    }
  },

  checkIsInRoom: (io, socket, clients, listenerSocketIds) => {
    let isInRoom = listenerSocketIds.some(listenerSocketId => {
      return clients.has(listenerSocketId)
    })
    console.log('==isInRoom==', isInRoom)

    return isInRoom
  },
}