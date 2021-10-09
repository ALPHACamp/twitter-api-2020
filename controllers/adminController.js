const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Followship = db.Followship
const Like = db.Like
const Sequelize = db.Sequelize


const adminController = {
  getTweets: async (req, res) => {
    try {
      const allTweets = await Tweet.findAll({
        order: [[Sequelize.literal('createdAt'), "DESC"]],
        include: [{ model: User, as: 'user', attributes: ['name', 'account', 'avatar', 'createdAt'] }]
      })
      return res.json({ allTweets })
    }
    catch (error) {
      console.log(error)
    }
  },

  getUsers: async (req, res) => {
    console.log('================')
    try {
      const allUsers = await User.findAll({
        where: { role: 'user' },
        attributes: [
          'name', 'account', 'avatar', 'cover',
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('userTweets.id'))), 'tweetsCount'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('likes.id'))), 'likesCount']
          // [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Follwers.id'))), 'followingsCount'],
          // [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Followings.id'))), 'followersCount']
        ],
        include: [
          { model: Tweet, as: 'userTweets', attributes: [] },
          { model: Like, as: 'likes', attributes: [] },
          { model: User, as: 'Followings', attributes: [] },
          { model: User, as: 'Followers', attributes: [] },
        ],
        group: ['User.id'],
        order: [
          [sequelize.literal('tweetsCount'), 'DESC'],
        ],
      })

      return res.json(allUsers)
    }
    catch (error) {
      console.log(error)
    }
  },

  // getUsers: async (req, res) => {
  //   console.log('=============2=============')
  //   try {
  //     const allUsers = await User.findAll({
  //       where: { role: 'user' },
  //       attributes: [
  //         'name', 'account', 'avatar', 'cover',
  //         [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('userTweets.id'))), 'tweetsCount'],
  //         [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Likes.id'))), 'likesCount']
  //       ],
  //         include: [
  //           { model: Tweet, as: 'userTweets', attributes: [] },
  //           { model: Like, as: 'likes', attributes: [] },
  //           // { model: User, as: 'Followings', attributes: [] },
  //           // { model: User, as: 'Followers', attributes: [] },
  //         ],
  //       group: ['User.id'],
  //       // order: ['tweetsCount', 'DESC'],
  //       // order: [
  //       //   [sequelize.literal('tweetsCount'), 'DESC'],
  //       // ],
  //     })

  //     return res.json(allUsers)
  //   }
  //   catch (error) {
  //     console.log(error)
  //   }
  // },

  // getUsers: async (req, res) => {
  //   try {
  //     const allUsers = await User.findAll({
  //       where: { role: 'user' },
  //       attributes: ['name', 'account', 'avatar', 'cover'],
  //       // attributes: { include: [[Sequelize.fn("COUNT", Sequelize.col("userTweets.id")), "tweetsCount"]]},
  //       include: [
  //         { model: Reply, as: 'replies', attributes: ['id'] },
  //         { model: User, as: 'Followings', attributes: ['id'] },
  //         { model: User, as: 'Followers', attributes: ['id'] },
  //         { model: Like, as: 'likes', attributes: ['id'] },
  //         { model: Tweet, as: 'userTweets', attributes: [] }
  //       ],
  //       // group: ['User.id'],
  //       // order: ['tweetsCount', 'DESC'],
  //       // order: [
  //       //   [sequelize.literal('tweetsCount'), 'DESC'],
  //       // ],
  //     })

  //     return res.json(allUsers)
  //   }
  //   catch (error) {
  //     console.log(error)
  //   }
  // },

  deleteTweet: async (req, res) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      await tweet.destroy()
      return res.status(200).json('Accept')
    }
    catch (error) {
      console.log(error)
    }
  }
}

module.exports = adminController