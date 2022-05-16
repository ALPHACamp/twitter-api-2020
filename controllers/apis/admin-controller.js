const { User, Tweet, Identity, Like, Followship } = require('../../models')
// const { Sequelize } = require('sequelize')
// const sequelize = new Sequelize('sqlite::memory:')

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'account', 'name', 'coverImg', 'avatarImg']
        // include: [
        //   {
        //     model: Identity,
        //     where: { identity: 'user' },
        //     attributes: []
        //   }
        // ],
        // raw: true,
        // nest: true
      })
      console.log('===== test =====', users)
      // for (const user of users) {
      //   Promise.all([
      //     (user.tweetAmount = await Tweet.findAndCountAll({
      //       where: { UserId: user.id },
      //       attributes: ['id']
      //     })),
      //     (user.likeAmount = await Like.findAndCountAll({
      //       where: { UserId: user.id },
      //       attributes: ['id']
      //     })),
      //     (user.followingAmount = await Followship.findAndCountAll({
      //       where: { follower_id: user.id },
      //       attributes: ['id']
      //     })),
      //     (user.followedAmount = await Followship.findAndCountAll({
      //       where: { following_id: user.id },
      //       attributes: ['id']
      //     }))
      //   ])
      // }
      return res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  },

  deleteTweet: async (req, res, next) => {
    try {
      const deletedTweet = await Tweet.findByPk(req.params.id)
      if (!deletedTweet) throw new Error('找不到相關推文')
      await deletedTweet.destroy()
      return res.status(200).json({
        deletedTweet
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
