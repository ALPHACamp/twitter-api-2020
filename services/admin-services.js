const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')
const dayjs = require('dayjs')

const relativeTime = require('dayjs/plugin/relativeTime');
const { getUserLikes } = require('../controllers/apis/user-controller');
const helpers = require('../_helpers')

require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw')
dayjs.extend(relativeTime)
const adminServices = {
  getTweets: (req, cb) => {
    const UserId = helpers.getUser(req).id
    return Promise.all([
      Like.findAll({ where: { userId: UserId } }),
      Reply.findAll({ where: { userId: UserId } }),
      Tweet.findAll({ raw: true, include: [User] })
    ])
      .then(([likes, replies, tweets]) => {
        for (let i = 0; i < tweets.length; i++) {
          const createdAtDate = dayjs(tweets[i].createdAt);
          const updatedAtDate = dayjs(tweets[i].updatedAt);
          tweets[i].createdAt = createdAtDate.fromNow()
          tweets[i].updatedAt = updatedAtDate.fromNow()
          tweets[i]["likeCount"] = likes.length
          tweets[i]["replyCount"] = replies.length
        }
        cb(null, tweets);
      })
      .catch(err => cb(err));
  },

  postTweet: (req, cb) => {
    const { UserId, description } = req.body
    if (!UserId) res.status(500).json({
      status: 'error',
      data: {
        'Error Message': 'userId is required'
      }
    })
    const { file } = req
    Tweet.create({ UserId, description })
      .then(newTweet => cb(null, { tweet: newTweet }))
      .catch(err => cb(err))
  },
  deleteTweet: (req, cb) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          const err = new Error("Tweet didn't exist!")
          err.status = 404
          throw err
        }
        return tweet.destroy()
      })
      .then(deletedTweet => cb(null, { Tweet: deletedTweet }))
      .catch(err => cb(err))
  },
  getUsers: (req, cb) => {
    // User.findAll({
    //   raw: true,
    // })
    //   .then(users => {
    //     cb(null, users)
    //   })
    //   .catch(err => cb(err))
    return User.findAll({
      order: [['createdAt', 'DESC']],
      raw: true,

    }).then((userList) => {
      //console.log(userList)
      return Promise.all(
        userList.map(item => {
          return Promise.all([
            User.findByPk(item.id),
            Tweet.findAll({ where: { UserId: item.id } }),
            Followship.findAll({ where: { followerId: item.id } }),
            Followship.findAll({ where: { followingId: item.id } }),
            Like.findAll({ where: { UserId: item.id } }),
          ]).then(([user, tweetList, followingList, followerList, likeList]) => {
            const tweetsCount = Object.keys(tweetList).length
            const likesCount = Object.keys(likeList).length
            const followerCount = Object.keys(followerList).length
            const followingCount = Object.keys(followingList).length

            user = user.toJSON()
            delete user.password
            user["followers"] = followerCount
            user["followings"] = followingCount
            user["likesCount"] = likesCount
            user["tweetsCount"] = tweetsCount
            return user

          }).catch(err => next(err))
        })
      ).then(users => {
        users.sort((a, b) => b.tweetsCount - a.tweetsCount)
        cb(null, users)
      })
        .catch(err => cb(err))
    })
  },
}
module.exports = adminServices