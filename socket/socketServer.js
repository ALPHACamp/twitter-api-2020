const jwt = require('jsonwebtoken')
const { User, Message } = require('../models/index')
const moment = require('moment')
const userList = []

module.exports = (io) => {
  io.use(async (socket, next) => {
    //先檢查有沒有token
    if (!socket.handshake.query.token) return

    try {
      //從token找出使用者user
      const token = socket.handshake.query.token
      const { id } = jwt.verify(token, process.env.JWT_SECRET)
      let user = await User.findByPk(id, {
        attributes: ['id', 'name', 'account', 'avatar'],
        raw: true
      })

      //把重複user從userList刪除
      const duplicateUserIndex = userList.findIndex(u => u.id === user.id)
      if (duplicateUserIndex !== -1) {
        userList.splice(duplicateUserIndex, 1)
      }

      //有找到user=> push到userList陣列中和放入socket物件後傳下去
      if (user) {
        socket.user = user
        userList.push(user)
        next()
      }
    } catch (err) {
      return next(new Error('authentication error'))
    }
  }).on('connection', socket => {

    //後端監聽joinRoom event
    socket.on('joinRoom', async () => {
      // load history
      let historyMessages = await Message.findAll({
        attributes: ['id', 'content', 'time'],
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }],
        order: ['createdAt']
      })

      historyMessages = historyMessages.map(message => ({
        ...message.toJSON()
      }))

      socket.emit('loadMessages', historyMessages)

      //Broadcast when a new user connects
      socket.broadcast.emit('userJoin', `${socket.user.name}上線`)

      //Send currentUsers event
      io.emit('currentUsers', { userList, usersCount: userList.length })
    })

    //後端監聽前端userMessage
    socket.on('userMessage', async (message) => {
      if (message === '') return //前端傳空字串就不處理
      const time = moment().format('h:mm A')
      const historyMessage = await Message.create({
        UserId: socket.user.id,
        content: message,
        time
      })

      const serverMessage = {
        User: socket.user,
        content: message,
        time
      }

      io.emit('serverMessage', serverMessage)
    })

    //後端監聽disconnect event(關閉瀏覽器)
    socket.on('disconnect', () => {
      //1. remove leaving user from user list
      const index = userList.findIndex(user => user.id === socket.user.id)
      userList.splice(index, 1)
      //2. send new user list to frontend
      io.emit('currentUsers', { userList, usersCount: userList.length })
      //3. 
      socket.broadcast.emit('userLeave', `${socket.user.name}離線`)
    })
  })
}