const messageService = require('../../services/messageService')
const { generateRoomName, SearchListenerOnline, checkIsInRoom } = require('../../libs/utility')

module.exports = (io, socket) => {
  // 未讀通知
  socket.on('messageNotify', async msg => {
    try {
      const unReads = await messageService.searchUnread(io, socket, msg.id)

      socket.emit('messageNotify', unReads)

    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })

  // 進入房間
  socket.on('enterRoom', async msg => {
    try {
      const { id, listenerId } = msg
      let roomName = generateRoomName(id, listenerId)
      socket.join(roomName)
      console.log('===========roomName===========', roomName)

      await messageService.createPrivateRoom(id, listenerId, roomName)

      // 先清空 => 後搜尋未讀
      await messageService.clearUnread(io, socket, msg)
      const unReads = await messageService.searchUnread(io, socket, id)

      socket.emit('messageNotify', unReads)
    } catch (error) {
      console.log(error)
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })

  // 離開房間
  socket.on('leaveRoom', async msg => {
    try {
      const { id, listenerId } = msg
      let roomName = generateRoomName(id, listenerId)

      socket.leave(roomName)

    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })

  // 1on1私聊
  socket.on('privateMessage', async msg => {
    try {
      const { id, listenerId } = msg
      const roomName = generateRoomName(id, listenerId)
      // 找到房間內所有連線
      const clients = io.sockets.adapter.rooms.get(roomName)
      console.log(clients)

      if (!clients) {
        console.log('No clients in room')
        return
      }

      const { isOnline, listenerSocketIds } = SearchListenerOnline(io, socket, clients, listenerId)
      console.log(`===========isOnline=============`, isOnline, 'listenerSocketid: ', listenerSocketIds)

      msg.isInRoom = checkIsInRoom(io, socket, clients, listenerSocketIds)

      const message = await messageService.saveMessage(msg)
      const unReads = await messageService.searchUnread(io, socket, listenerId)

      io.to(roomName).emit('privateMessage', message)
      io.to(`user${listenerId}`).emit('messageNotify', unReads)

    } catch (error) {
      console.log(error)
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })
}