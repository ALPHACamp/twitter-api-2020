const { User, Tweet, Reply, Like, Followship } = require('../../models')
// const { Sequelize } = require('sequelize')
// const sequelize = new Sequelize('sqlite::memory:')

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'account', 'name', 'role', 'coverImg', 'avatarImg'],
        where: { role: 'user' },
        raw: true,
        nest: true
      })

      for (const user of users) {
        Promise.all([
          (user.tweetAmount = await Tweet.findAndCountAll({
            where: { UserId: user.id },
            attributes: ['id']
          })),
          (user.likeAmount = await Like.findAndCountAll({
            where: { UserId: user.id },
            attributes: ['id']
          })),
          (user.followingAmount = await Followship.findAndCountAll({
            where: { follower_id: user.id },
            attributes: ['id']
          })),
          (user.followedAmount = await Followship.findAndCountAll({
            where: { following_id: user.id },
            attributes: ['id']
          }))
        ])
      }
      return res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  },

  deleteTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const deletedTweet = await Tweet.findByPk(tweetId)
      if (!deletedTweet) throw new Error('找不到相關推文')

      await Reply.destroy({ where: { tweet_id: tweetId } })
      await Like.destroy({ where: { tweet_id: tweetId } })
      await Tweet.destroy({ where: { id: tweetId } })

      return res.status(200).json({
        deletedTweet
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
