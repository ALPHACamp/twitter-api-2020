/* DB */
const db = require('../../models')
const { User, Tweet, Like, Reply } = db

/* necessary package */
const bcrypt = require('bcryptjs')
// IMGUR
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'e34bbea295f4825'
// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
//helpers
const helpers = require('../../_helpers')
const sequelize = require('sequelize')
const adminController = {
  //登入
  signIn: async (req, res) => {
    try {
      // 檢查必要資料
      if (!req.body.email || !req.body.password) {
        return res.json({ status: 'error', message: "required fields didn't exist" })
      }
      // 檢查 user 是否存在與密碼是否正確
      let { email, password } = req.body
      const user = await User.findOne({ where: { email } })
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      if (user.role !== "admin") {
        return res.status(401).json({ status: 'error', message: 'Permission denied' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, 'alphacamp')
      return res.json({
        status: 'success',
        message: 'Admin login successfully',
        token: token,
        user
      })
    } catch (e) { console.log(e) }
  },

  // getUsers: async (req, res) => {
  //   try {
  //     LikedUsers = await Tweet.findAll({
  //       include: [{ model: User, as: 'LikedUsers' }],
  //     })

  //     let tweetID2LikedUsersCount = {}
  //     LikedUsers.map((d, index) => {
  //       tweetID2LikedUsersCount[d.id] = d.LikedUsers.length
  //     })

  //     const user = await User.findAll({
  //       attributes: [
  //         'User.id',
  //         [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.userId = User.id)'), 'TweetCount'],
  //         [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'FollowersCount'],
  //         [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'), 'FollowingsCount'],
  //       ],
  //       raw: true,
  //       nest: true,
  //     })

  //     let user2 = await User.findAll({
  //       include: [{ model: Tweet }],
  //     })

  //     xx = {}
  //     for (let ob of user) {
  //       xx[ob.id] = {
  //         'TweetCount': ob.TweetCount,
  //         'FollowersCount': ob.FollowersCount,
  //         'FollowingsCount': ob.FollowingsCount,
  //         'LikedUsersCount': 0
  //       }
  //     }
  //     console.log('xxxxxxxxxxxxxxxxxxxxxxxxxx')

  //     for (let user of user2) {
  //       let total = 0
  //       for (let Tweetdata of user.Tweets) {
  //         total += tweetID2LikedUsersCount[Tweetdata.id]
  //         console.log('Tweetdata.id', Tweetdata.id)
  //         console.log('total', total)
  //       }
  //       console.log(xx)
  //       console.log(user.id)
  //       xx[String(user.id)]['LikedUsersCount'] = total
  //     }
  //     console.log('9999999999999999999')
  //     console.log(xx)
  //     console.log(user2)
  //     // console.log(JSON.stringify(user2, null, 2))
  //   } catch (e) { console.log(e) }
  // },
  getTweets: async (req, res) => {
    try {
      const result = await Tweet.findAndCountAll({ include: [User] })
      const data = await result.rows.map((tweet) => ({
        ...tweet.dataValues,
        description:
          tweet.dataValues.description.length >= 50
            ? tweet.dataValues.description.substring(0, 50) + '...'
            : tweet.dataValues.description,
      }))
      return res.json(data)
    } catch (e) { console.log(e) }
  },
  getTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      await tweet.destroy()
      return res.json({ status: 'success', message: 'Delete tweet successfully' })
    } catch (e) { console.log(e) }
  }
}


module.exports = adminController

// const user = await User.findAll({
//   attributes: {
//     include: [
//       [sequelize.fn('count', sequelize.col('Tweets.id')), 'tweetCount'],
//       [sequelize.fn('count', sequelize.col('Followers.id')), 'FollowersCount'],

//       [sequelize.fn('count', sequelize.col('Followings.id')), 'FollowingsCount'],
//       [sequelize.literal('(SELECT COUNT(*) FROM Tweets JOIN Likes ON TweetId)'), 'TweetsLikesCount']
//     ]
//   }, include:
//     [{ model: Tweet, attributes: [] }, { model: Like, attributes: [] }, { model: User, attributes: [], as: 'Followers' }, { model: User, as: 'Followings', attributes: [] }],
//   group: ['User.id'],
//   raw: true,
//   nest: true,
//         order: [[sequelize.literal('tweetCount'), 'DESC']],


