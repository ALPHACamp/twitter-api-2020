const { Like, Tweet, User } = require('../models')

const adminController = {
  getUsers: (req, res, next) => {
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
      res.status(200).json(users)
    })
    .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    // DELETE /admin/tweets/:id - 刪除使用者的推文
    return Tweet.findByPk(req.params.id)
    .then(tweet => {
      if(!tweet) throw new Error("The tweet does not exist!")
      return tweet.destroy()
    })
    .then(data => res.json(data))
    .catch(err => next(err))
  }  
}

module.exports = adminController