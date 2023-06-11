const { Tweet, User, Like, Reply } = require('../models')
const { relativeTimeFromNow } = require('../helpers/dayjs-helpers')
const { getUserData } = require('../helpers/getUserData')
const helpers = require('../_helpers')
const tweetServices = {
  getTweets: async (req, cb) => {
    try {
      let tweets = await Tweet.findAll({
        include: [
          {
            model: User,
            attributes: ['name', 'avatar', 'account']
          }, {
            model: Like,
            attributes: ['id']
          }, {
            model: Reply,
            attributes: ['id']
          }],
        order: [['createdAt', 'DESC']]
      })

      if (!tweets) throw new Error("目前沒有任何推文！")
      const userLikedTweetsId = getUserData(req.user.LikedTweets)
      tweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        isLiked: userLikedTweetsId.length ? userLikedTweetsId.includes(tweet.id) : false,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length
      }))

      cb(null, tweets)
    } catch (err) {
      cb(err)
    }
  },
  getTweet: async (req, cb) => {
    const { id } = req.params
    return Promise.all([
      Tweet.findByPk(id, {
        include: [
          User,
        ],
        nest: true,
        raw: true
      }),
      Like.count({
        where: {
          TweetId: id
        }
      }),
      Reply.count({
        where: {
          TweetId: id
        }
      ,order: [['createdAt', 'DESC']]
      })
    ])
      .then((tweet) => {if(tweet.id !== id) throw new Error("推文不存在！")})
      .then(([tweet, likes, replies]) => {
        cb(null, {
          ...tweet,
          likeCount: likes,
          replyCount: replies,
          createdAt: relativeTimeFromNow(tweet.createdAt)
        })
      })
      .catch(err => cb(err))
  },
  postTweets: async (req, cb) => {
    try {
      const { description } = req.body
      const UserId = helpers.getUser(req).id

      if (!description) {
        throw new Error('Tweet不能為空!')
      }

      if (description.length > 140) {
        throw new Error('輸入不得超過140字!')
      }

      const tweet = await Tweet.create({
        description,
        UserId,
      })
      const tweetData = tweet.toJSON()
        tweetData.createdAt = relativeTimeFromNow(tweetData)
      return cb(null, {
        status: 'success',
        message: '登入成功！',
        tweetData
      })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = tweetServices