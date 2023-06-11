const helpers = require('../_helpers')

const { relativeTimeFromNow } = require('../helpers/dayjs-helpers')
const { getUserData } = require('../helpers/getUserData')
const { Tweet, User, Like, Reply } = require('../models')

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
      .catch(err => cb (err))
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
      return cb (null, {
        status: 'success',
        message: '登入成功！',
        tweetData
      })
    } catch (err) {
      cb (err)
    }
  },
  addLike: async(req, cb) => {
    try{
      const { id } = req.params
      const tweet = await Tweet.findByPk(id)
      const like = await Like.findOne({
              where: {
                UserId: helpers.getUser(req).id,
                TweetId: id
              }
            })
      if (tweet.id !== Number(id)) throw new Error("Tweet不存在!")
      if (like) throw new Error('你已經like過這篇Tweet了')

      const likeCreate = await Like.create({
        UserId: helpers.getUser(req).id,
        TweetId: Number(id)
      })
      cb (null, likeCreate)
    } catch (err) {
          cb (err)
    }
  },
  removeLike: async (req, cb) => {
    try {
      const { id } = req.params
      const like = await Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          tweetId: id
        }
      })
      if (!like) {
        throw new Error('這篇Tweet沒被like')
      }

      await like.destroy()
      cb (null,{ message: 'Like 取消成功' })
    } catch (err) {
      cb (err)
    }
  }
}

module.exports = tweetServices