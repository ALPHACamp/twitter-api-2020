const adminServices = require('../services/admin-services')
const { Tweet, User, Like, Reply } = require('../models')
const adminController = {
  signIn: (req, res, next) => {
    adminServices.signIn(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) => err ? next(err) : res.json(data))
  },


  delTweet: async(req, res, next) => {
    const { id } = req.params
    try{
      const tweet = await Tweet.findByPk(id)
      if (!tweet) throw new Error("推文不存在！")
      await tweet.destroy()
      await Reply.destroy({ where: { TweetId: id } })
      await Like.destroy({ where: { TweetId: id } })
      return res.json({ status: 'success', message: '刪除成功' })
    } catch (err) {
    next(err)
    }
  }
}
module.exports = adminController