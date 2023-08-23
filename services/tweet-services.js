const { Tweet, User, Reply, Like } = require('../models')
const { relativeTimeFormat } = require('../helpers/day-helpers')

const tweetServices = {
  getTweets: (req, cb) => {
    Tweet.findAll({
      raw: true,
      include: [
        { model: User, attributes: ['avatar', 'name', 'account'] },
        { model: Reply, attributes: ['tweetId'] },
        { model: Like, attributes: ['tweetId'] }
      ],
      order: [
        ['createdAt', 'DESC']
      ]
    })
      .then(tweets => {
        let Count = (value, arr) => arr.reduce((t, c) => c === value ? t + 1 : t, 0)
        const replyList = []
        const likeList = []
        tweets.map(tweet => {
          replyList.push(tweet["Replies.tweetId"])
          likeList.push(tweet["Likes.tweetId"])
        })
        const data = tweets.map(tweet => {
          let subDescription = tweet.description.length > 80 ? tweet.description.substring(0, 80) + '...' : tweet.description
          return {
            ...tweet,
            description: subDescription,
            createdAt: relativeTimeFormat(tweet.createdAt),
            replyCount: Count(tweet.id, replyList),
            likeCount: Count(tweet.id, likeList)
          }
        })
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    const { id } = req.params
    Tweet.findByPk(id, { raw: true }).then(tweet => {
      if (!tweet) {
        const err = new Error('推文不存在！')
        err.status = 404
        throw err
      }
      return cb(null, { tweet })
    })
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const UserId = req.user.dataValues.id
    const { description } = req.body
    if (!UserId) throw new Error('用戶不存在！')
    if (!description) throw new Error('內容不可空白')
    if (description.length > 140) throw new Error('內容不得超過140字！')
    return Tweet.create({ description, UserId })
      .then(newTweet => cb(null, { tweet: newTweet }))
      .catch(err => cb(err))
  }
}

module.exports = tweetServices
