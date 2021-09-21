const jwt = require('jsonwebtoken')
const db = require('./models')
const { User } = db

module.exports = (io) => {
  const public = io.of('/public')

  // 使用者驗證,並拿到user資料
  public.use((socket, next) => {
    if (socket.handshake.auth.token) {
      jwt.verify(socket.handshake.auth.token, process.env.TOKEN_SECRET, async (err, decoded) => {
        // decoded會拿到登入user的id
        const id = decoded.id
        if (err) return next(new Error('請先登入在使用'));
        socket.decoded = decoded;
        const user = await User.findOne({
          attributes: ['id', 'avatar', 'name', 'account'],
          where: { id }
        })
        // 將登入者存到socket.request中
        socket.request.user = user.toJSON()
        next();
      });
    }
    else {
      next(new Error('請先登入在使用'));
    }
  })

}