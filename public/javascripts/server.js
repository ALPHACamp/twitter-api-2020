let onlineList = {}
let offlineRecord = {}
const db = require('../../models')
const User = db.User
const Friendship = db.Friendship
const Sequelize = db.Sequelize
const Op = Sequelize.Op

function socketConnection (io) {
  io.on('connection', socket => {
    socket.on('connectServer', async ({ userId }) => {
      // 建立上線用戶表
      onlineList[userId] = socket.id
      if (offlineRecord[userId]) {
        socket.to(socket.id).emit('unread', {message: offlineRecord[userId]})
        offlineRecord[userId] = []
      }

      const user = Number(userId)

      // 取出該上線用戶所有朋友資料
      const friendData = await Friendship.findAll({
        raw: true,
        attributes: ['adder', 'added'],
        where: { [Op.or]: [
          { adder: { [Op.eq]: user } },
          { added: { [Op.eq]: user } }
        ] }
      })

      // 整理成陣列
      const friendList = friendData.map(element => {
        return element.adder === user? element.added: element.adder
      })

      // 對每個在線上的朋友發出上線通知
      friendList.forEach(async (element) => {
        element = element.toString()
        await io.to(onlineList[element]).emit('online-notice', 'on')
      })

      // 監聽並建立房間
      socket.on('join-room', (data) => {
        socket.join(data.roomId)
        const targetId = data.targetId.toString()
        if (onlineList[targetId]) {
          const target = onlineList[targetId].socket
          target.join(data.roomId)
        } else {
          offlineRecord[targetId] = [data.roomId]
        }
        console.log("🚀 ~ file: server.js ~ line 43 ~ socket.on ~ socket", socket.rooms)
        socket.emit(data.roomId, 'hello') //for testing 單獨使用emit會產生廣播
      })

      //建立通話 使用broadcast不會傳送給發訊者
      socket.on('chatMessage', (data) => {
        const room = data.roomId
        const message = data.msg
        const targetId = data.targetId.toString()
        if (onlineList[targetId]) {
          socket.broadcast
          .to(room)
          .emit('chatMessage', message)
        } else {
          offlineRecord[targetId].push(message)
        }
      })

      
    })
  })
}

module.exports = socketConnection