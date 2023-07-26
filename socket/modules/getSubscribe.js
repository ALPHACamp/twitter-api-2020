const { emitError, findUserInPublic } = require('../helper')
const { Subscribe, User } = require('../../models')

module.exports = async socket => {
  try {
    // 確認使用者是否登入
    const currentUser = findUserInPublic(socket.id, 'socketId')

    // 找出所有使用者訂閱的人
    const subscribes = await Subscribe.findAll({
      where: { fromUserId: currentUser.id },
      attributes: [],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }
      ],
      order: [['id', 'DESC']],
      raw: true
    })

    socket.emit('server-get-subscribe', subscribes)
  } catch (err) {
    emitError(socket, err)
  }
}
