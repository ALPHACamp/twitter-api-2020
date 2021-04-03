const db = require('../../models')
const helpers = require('../../_helpers')
const { Followship, User } = db

const followshipController = {
  follow: async (req, res) => {
    /* #swagger.tags = ['Followhship']
       #swagger.description = '追蹤使用者'
       #swagger.parameters['id'] = {
            in: 'body',
            type: "object",
            description: "要追蹤的人的user id",
            schema: {id: 1},
            required: true
       }
        #swagger.responses[200] = {
          description: '回傳success物件',
          schema: {"$ref": "#/definitions/SuccessMessage"}
        }
      #swagger.responses[400] = {
         description: '找不到user,沒有提供id,或已經follow過這個user了回傳error物件',
         schema: { status: 'error', message: 'user already followed by this user' }
       }
    */
    try {
      const { id } = req.body
      const userId = helpers.getUser(req).id
      if (Number(id) === userId) {
        return res.status(400).json({ status: 'error', message: 'You cannot follow yourself' })
      }
      // check if user id exist or doesn't have id in req.body
      const user = await User.findByPk(id)
      if (!user) {
        return res.status(400).json({ status: 'error', message: 'user doesn\'t exist or id is not provided' })
      }
      // check if already followed
      const follow = await Followship.findOne({
        where: { followerId: userId, followingId: id }
      })
      if (follow) {
        return res.status(400).json({ status: 'error', message: 'user already followed by this user' })
      }

      await Followship.create({
        followerId: userId,
        followingId: id
      })
      return res.status(200).json({ status: 'success', message: 'Success' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },
  unfollow: async (req, res) => {
  /* #swagger.tags = ['Followhship']
      #swagger.description = '取消追蹤使用者'
      #swagger.responses[200] = {
        description: '回傳success物件',
        schema: {"$ref": "#/definitions/SuccessMessage"}
      }
    #swagger.responses[400] = {
       description: '沒有追蹤或是找不到user id回傳error物件',
       schema: { status: 'error', message: 'tweet id does not exist' }
     }
  */
    try {
      const { followingId } = req.params
      const userId = helpers.getUser(req).id
      if (Number(followingId) === userId) {
        return res.status(400).json({ status: 'error', message: 'You cannot unfollow yourself' })
      }
      const follow = await Followship.findOne({
        where: { followerId: userId, followingId }
      })
      if (!follow) {
        return res.status(400).json({ status: 'error', message: 'no followed record or no user id found' })
      }
      await follow.destroy()
      return res.status(200).json({ status: 'success', message: 'Success' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  }
}

module.exports = followshipController
