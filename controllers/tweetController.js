const db = require('../models')
const Reply = db.Reply
const Tweet = db.Tweet
const User = db.User
const Like = db.Like

const tweetController = {
  getTweets: (req, res, next) => {
    //TODO:有req.user存在時，是user有追蹤的人才會出現推文
    // return User.findByPk(req.res.id,{
    //   include: [User, Reply, Like],
    //   order: [['createdAt', 'DESC']]
    // })
    // .then((user)=>{
    //   return res.status(200).json(user)
    // })
    return Tweet.findAll({
      include: [{ model: User, where: { id: req.user.id }}],
      order: [['createdAt', 'DESC']],
    })
      .then(tweets => {
        // tweets = tweets.map(tweet => ({
        //   id: tweet.id,
        //   UserId: tweet.UserId,
        //   description: tweet.description,
        //   createdAt: tweet.createdAt,
        //   updatedAt: tweet.updatedAt,
        //   replyCounts: tweet.Replies.length,
        //   likeCounts: tweet.Likes.length,
        //   //TODO:使用者資料傳來後修正
        //   isLike: false,
        //   user: {
        //     name: tweet.User.name,
        //     avatar: tweet.User.avatar,
        //     account: tweet.User.account,
        //   }
        // }))
        return res.status(200).json(tweets)
      }).catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    Tweet.findByPk(req.params.id,
      { include: [User, Reply, Like] })
      .then(tweet => {
        if (!tweet) {
          return res.status(404).json({
            status: 'error',
            message: 'Can not find this tweet!'
          })
        }
        tweet = {
          id: tweet.id,
          description: tweet.tweet,
          createdAt: tweet.createdAt,
          updatedAt: tweet.updatedAt,
          replies: tweet.Replies,
          replyCounts: tweet.Replies.length,
          likeCounts: tweet.Likes.length,
          isLike: req.user.LikedTweets.map(like => like.id).includes(tweet.id),
          user: {
            name: tweet.User.name,
            avatar: tweet.User.avatar,
            account: tweet.User.account,
          }
        }
        res.status(200).json(tweet)
      }).catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          return res.status(404).json({
            status: 'error',
            message: 'Can not find this tweet!'
          })
        }
        if (tweet.UserId !== req.user.id) {
          return res.status(404).json({
            status: 'error',
            message: 'you can not delete this tweet!'
          })
        }
        Promise.all([
          tweet.destroy(),
          Reply.destroy({ where: { TweetId: tweet.id } }),
          Like.destroy({ where: { TweetId: tweet.id } })
        ])
          .then(() => {
            res.status(200).json({
              status: 'success',
              message: 'delete successfully'
            })
          }).catch(err => next(err))
      }).catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    if (!description.trim()) {
      return res.status(404).json({
        status: 'error',
        message: 'Tweet can not be blank!'
      })
    }
    if (description.length < 140) {
      return res.status(404).json({
        status: 'error',
        message: 'Tweet should be longer 140 characters!'
      })
    }
    Tweet.create({
      description: description,
      UserId: req.user.id
    })
      .then(() => {
        res.status(200).json({
          status: 'success',
          message: 'Successfully posted'
        })
      }).catch(err => next(err))
  },
  putTweet: (req, res, next) => {
    const { description } = req.body
    Tweet.findByPk(req.params.id)
    .then(tweet=> {
      if(!tweet){
        return res.status(404).json({
          status: 'error',
          message: 'Can not find this tweet!'
        })
      }
      if(tweet.UserId !== req.user.id){
        return res.status(404).json({
          status: 'error',
          message: 'you can not edit this tweet!'
        })
      }
      if (description.length < 140) {
        return res.status(404).json({
          status: 'error',
          message: 'Tweet should be longer 140 characters!'
        })
      }
      tweet.update({
        id: tweet.id,
        UserId: tweet.UserId,
        description: description,
      })
      return res.status(200).json({
        status: 'success',
        message: 'edit successfully'
      })
    })
  }
}
module.exports = tweetController