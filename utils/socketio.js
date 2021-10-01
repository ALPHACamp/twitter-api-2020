const { User, Sequelize } = require('../models')
const socketio = require('socket.io')
const { postChat, createRoom } = require('../controllers/chatroomController')

let io
let onlineList = []

const socket = server => {
  // Set up socket.io
  io = socketio(server, {
    cors: {
      origin: [
        'https://danielgg1024.github.io/twitter-front-end-vue/',
        'http://localhost:3000',
        'http://localhost:8080',
        'https://tranquil-crag-64775.herokuapp.com/'
      ],
      methods: ['GET', 'POST'],
      transports: ['websocket', 'polling'],
      credentials: true
    },
    allowEIO3: true
  })
  console.log('Socket.io init success')
  if (!io) throw new Error('No socket io server instance')

  io.on('connection', socket => {
    console.log(socket.user)
    console.log('===== connected!!! =====')
    /*-----------------PublicRoom--------------------- */
    socket.on('joinPublic', async (userId) => {
      await socket.join('PublicRoom')
      console.log('PublicRoom', io.of("/").adapter.rooms)
      console.log('userId', userId)
      let user = await User.findByPk(userId, { attributes: ['id', 'name', 'account', 'avatar'] })
      user = user.toJSON()
      console.log('user',user)
      addUser(user)
      console.log('----onlineList----')
      console.log(onlineList)
      console.log('---clientsCount in ---')
      console.log('clientsCount', onlineList.length)
      const roomId = 1
      io.emit("announce", { user, roomId })
    })

    socket.on('chatmessage', async (data) => {
      // 預設傳入data = {roomId, userId, msg}
      const { roomId, userId, msg } = data
      console.log(data)
      let user = await User.findByPk(userId, { attributes: ['id', 'name', 'account', 'avatar'] })
      console.log(user)
      user = user.toJSON()
      console.log(roomId)
      console.log(user)
      io.to(data.roomId).emit('newMessage', { user: user, msg: msg, date: new Date() })
      postChat(user, data.msg, roomId)
    })

    socket.on('leavePublic', async(userId) => {
      console.log('============leavePublic===============')
      console.log('onlineList', onlineList)
      let userIndex = onlineList.findIndex(x => x.id === Number(userId))
      if(userIndex !== -1){
        getRemoveUser(userIndex)
        await socket.leave('PublicRoom')
        console.log('LeavePublicRoom', io.of("/").adapter.rooms)
      }
    })
  })
}

function addUser(user) {
  let exist = onlineList.some(u => u.id === user.id)
  //console.log(exist)
  if (exist) {
    io.emit('onlineList', onlineList)
  } else {
    onlineList.push(user)
    io.emit('onlineList', onlineList)
  }
}

// GET removeUserName, 更新onlineList
function getRemoveUser(userIndex){
  const userName = onlineList[userIndex].name
  console.log(userName,'離開')
  io.emit("announce",　` ${userName} 離開`)
  onlineList.splice(userIndex,1)
  console.log('-------刪除後onlineList------')
  console.log(onlineList)
}




module.exports = { socket }