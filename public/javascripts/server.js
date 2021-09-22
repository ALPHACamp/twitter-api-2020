let onlineList = {}
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
        }
        console.log("🚀 ~ file: server.js ~ line 43 ~ socket.on ~ socket", socket)
        socket.emit(data.roomId, 'hello') //for testing
      })

      
    })
  })
}

module.exports = socketConnection