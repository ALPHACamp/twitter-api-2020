const { Tweet,Like,Reply ,User} = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const tweetServices = {
  getTweets: (req, cb) => {
   //預設可以再改 
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Tweet.findAndCountAll({
      offset,
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then((tweets) => {
        const repliedTweetId = req.user?.Replies ? req.user.Replies.map(rt => rt.TweetId) : []
        const likedTweetId = req.user?.Likes ? req.user.Likes.map(lt => lt.TweetId) : []
        const data = tweets.rows.map(t => ({
          ...t,
          description: t.description.substring(0, 50),
          isReplied: repliedTweetId.includes(t.id),
          isLiked: likedTweetId.includes(t.id)
        }))
        return cb(null, {
          tweets: 
          data,
          pagination: getPagination(limit, page, tweets.count)
        })
      })
      .catch(err => cb(err))
  }, getTweet: (req, cb) => {
    const id = req.params.tweet_id
    return Tweet.findByPk(id, {
      include: [{ model: Reply, include: User }, {
        model: Like, include: User
      }]
    })
      .then(tweet => {
        if (!tweet) throw new Error("Tweet doesn't exist!")
        const repliesOfTweet=tweet.Replies
        const likesOfTweet=tweet.Likes
        const isReplied = repliesOfTweet?repliesOfTweet.some(f => f.UserId === req.user.id) :[]
        const isLiked = likesOfTweet ? likesOfTweet.some(f => f.UserId === req.user.id) : []
        cb(null, {
          tweet: tweet.toJSON(),
          
          isReplied, isLiked
        })
      })
      .catch(err => cb(err))
  }, postTweet: (req, cb) => {
    const { description } = req.body
    const UserId = req.user.id
    if (!description) throw new Error('Description is required!')
    return User.findByPk(UserId)
      .then((User) => {
        if (!User) throw new Error("User didn't exist!")
        return Tweet.create({
          description,
          UserId
        })
      })
      .then(postedTweet => cb(null, { postedTweet }))
      .catch(err => cb(err))
  }
}


module.exports = tweetServices