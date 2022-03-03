const { Tweet, User, Like } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      raw: true,
      nest: true,
      order: [['createdAt', 'desc']],
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'account', 'name', 'avatar']
        },
        {
          model: User,
          as: 'LikedUsers',
          attributes: ['id']
        }
      ]
    })
      .then((tweets) => {
        tweets = tweets.map((tweet) => {
          const { id, UserId, description, likeCount, replyCount, createdAt, updatedAt, User } = tweet
          // console.log(tweet.LikedUsers)
          return {
            id,
            UserId,
            description,
            likeCount,
            replyCount,
            createdAt,
            updatedAt,
            User,
            isLiked: tweet.LikedUsers.Like.UserId === helpers.getUser(req).id,
          }
        })
        return res.status(200).json(tweets)
      })
      // .then((tweets) => {
      //   console.log(tweet.LikedUsers[0])
      //   const tweetsLiked = tweets.map(tweet => ({
      //     ...tweet,
      //     isLiked: tweet.LikedUsers.length !== 0 &&
      //       tweet.LikedUsers[0].id === helpers.getUser(req).id
      //     //isLiked: helpers.getUser(req).LikedTweets.some(f => f.id === tweet.id)
      //     // && tweet.LikedUsers.Like.isDeleted !== 1
      //   }))
      //   return res.status(200).json(tweetsLiked) 
      // })
      .catch((error) => res.status(500).json({
        status: 'error',
        message: error
      }))
  },
  getTweet: (req, res) => {
    Promise.all([
      Tweet.findByPk(req.params.id, {
        include: [{
          model: User,
          attributes: ['id','name','account','avatar']
        },
        {
          model: User,
          as: 'LikedUsers',
          attributes: ['id'],
          through: {
            attributes: []
          }
        }
        ]
      }),
      Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.id
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) {
          return res.status(404).json({
            status: 'error',
            message: '推文不存在'
          })
        } else {
          tweet = tweet.toJSON()
          const { id, UserId, description, likeCount, replyCount, createdAt, updatedAt, User } = tweet
          return res.status(200).json({
            id,
            UserId,
            description,
            likeCount,
            replyCount,
            createdAt,
            updatedAt,
            User,
            isLike: tweet.LikedUsers.some((user) => user.id === helpers.getUser(req).id),
          })
        }
          // console.log(tweet.LikedUsers[0].id)
          // console.log(helpers.getUser(req).id)
          // const tweetsLiked = {
          //   ...tweet.toJSON(),
          //   isLiked: tweet.LikedUsers.length !==0 &&
          //     tweet.LikedUsers[0].id === helpers.getUser(req).id
          //   // isLiked: helpers.getUser(req).LikedTweets.some(f => f.id === tweet.id) 
          //   // && like.isDeleted !== true
          // }
          // return res.status(200).json(tweetsLiked)
        // }
      })
      .catch((error) => res.status(500).json({
        status: 'error',
        message: error
      }))
  },
  postTweet: async (req, res) => {
    const { description } = req.body
    const UserId = helpers.getUser(req).id
    if (!description) {
      return res
        .status(400)
        .json({
          status: 'error',
          message: '內容不可為空白'
        })
    }
    if (description.length > 140) {
      return res
        .status(400)
        .json({
          status: 'error',
          message: '不可超過140字'
        })
    }
    Tweet.create({
        description,
        UserId
      })
      .then(tweet => {
        return User.findByPk(UserId)
          .then(user => user.increment('tweetCount'))
          .then(() => res.status(200).json(tweet))
      })
      .catch(error => res.status(500).json({
        status: 'error',
        message: error
      }))
  }
}
module.exports = tweetController