const { Followship } = require('../models')
const helpers = require('../_helpers')


const followshipController = {
  postFollowship: (req, res) => {
    console.log(req.body.id)
    const followings = req.user.toJSON().Followings
    // 判斷有沒有追蹤過
    const data = followings.map(item => Number(item.id)).includes(Number(req.body.id))
    // 不能追蹤自己
    if(Number(req.user.id) === Number(req.body.id)) {
      return res.status(200).json({ status: 'error', message: '使用者不能追蹤自己' })
    }
    // 不能重複追蹤
    if(data) {
      return res.status(200).json({ status: 'error', message: '已追蹤' })
    }
    return Followship.create({
      followerId: helpers.getUser(req).id,
      //正在追蹤誰
      followingId: req.body.id,
    })
      .then((tweet) => {
        return res.json({ status: 'success', message: 'Followship was successfully create' })
      })
      .catch(error => console.error(error))
  },

  deleteFollowship: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        //正在追蹤誰
        followingId: req.params.followingId,
      }
    })
      .then(async (followship) => {
        await followship.destroy()
        return res.json({ status: 'success', message: 'Followship was successfully delete' })
      })

  },

}
module.exports = followshipController
