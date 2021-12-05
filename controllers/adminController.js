const { Tweet, User, Like } = require('../models')

const adminController = {
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({ include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }, { model: Like }, { model: Tweet }] })

      let result = users.map(user => ({
        id: user.dataValues.id,
        avatar: user.dataValues.avatar,
        account: user.dataValues.account,
        name: user.dataValues.name,
        tweetCounts: user.dataValues.Tweets.length,
        likeCounts: user.dataValues.Likes.length,
        followships: {
          followerCounts: user.dataValues.Followers.length,
          followingCounts: user.dataValues.Followings.length
        }
      }))

      result = result.sort((a, z) => z.tweetCounts - a.tweetCounts)
      return res.status(200).json(result)
      } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  }

  deleteTweet: async (req, res) => {
    try {
      await Tweet.destroy({where: {id: Number(req.params.id)}});
      return res.status(200).json({ status: 'success', message: '成功刪除貼文' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  }
}

module.exports = adminController
