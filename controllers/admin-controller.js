const { Like, Tweet, User } = require('../models')

const adminController = {
  getUsers: (req, res, next) => {
    // GET /api/admin/users - 瀏覽使用者清單
    return User.findAll({
      attributes:['id', 'account', 'name', 'avatar'],
      include:[{
        model: Tweet,
        as: 'Tweets',
        attributes: ['UserId']
      },
      {
        model: Like,
        as: 'Likes',
        attributes: ['UserId']
      },
      {
      model: User,
      as: 'Followers'
      },
      {
      model: User,
      as: 'Followings'
      }
    ]
    })
    .then(users => {
      users = users.map(user => ({
        ...user.toJSON(),
        tweetCount: user.Tweets.length,
        likeCount: user.Likes.length,
        followerCount: user.Followers.length,
        followingCount: user.Followings.length,
        Tweets: ['omit'],
        Likes: ['omit'],
        Followers: ['omit'],
        Followings: ['omit']
      }))
      .sort((a, b) => ( b.tweetCount - a.tweetCount ))
      res.status(200).json(users)
    })
    .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    // GET /api/admin/tweets - 瀏覽全站的 Tweet 清單
    return Tweet.findAll({
      attributes: { exclude: ['updatedAt', 'UserId'] },
      include: [{
        model: User,
        attributes: ['id', 'account', 'avatar', 'name']
      }],
      nest: true,
      raw: true
    })
    .then(tweets => {
      if(!tweets) throw new Error("There are no Tweets!")
      const data = tweets.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50)
      }))
      res.status(200).json(data)
    })
    .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    // DELETE /api/admin/tweets/:id - 刪除使用者的推文
    return Tweet.findByPk(req.params.id)
    .then(tweet => {
      if(!tweet) throw new Error("The tweet does not exist!")
      return tweet.destroy()
    })
    .then(data => res.json({
      status: 'success',
      deleted_tweet: data
    }))
    .catch(err => next(err))
  } 
}

module.exports = adminController