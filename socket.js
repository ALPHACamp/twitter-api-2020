const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = 3001

app.get('/', (req, res) => {
  res.sendFile('socket/index.html', { root: __dirname })
})

io.on('connection', socket => {
  console.log('a user connected')
  socket.on('chat message', msg => console.log(`message: ${msg}`))
  socket.on('chat message', msg => io.emit('chat message', msg))
  socket.on('disconnect', () => console.log('a user disconnected'))
})

server.listen(port, () => console.log(`socket server listening on port ${port}!`))

module.exports = io
