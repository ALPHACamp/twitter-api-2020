const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const helpers = require('../_helpers')

const userController = {
  signIn: (req, res, next) => {
    // POST /api/users/signin - 使用者登入
    const { account, password } = req.body
    if (!account || !password) throw new Error('account and password are required!')

    return User.findOne({ where: { account } })
      .then(user => {
        if (!user) throw new Error('帳號不存在！')
        if (user.role === 'admin') throw new Error('帳號不存在！')
        if (!bcrypt.compareSync(password, user.password)) throw new Error('incorrect account or password!')
        console.log('使用者', user)
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        res.status(200).json({
          status: 'success',
          data: {
            token,
            user: userData
          }
        })
      })
      .catch(err => next(err))
  },
  postUser: (req, res, next) => {
    // POST /api/users - 註冊新使用者帳戶
    const userData = validateData(req.body)
    const { account, name, email, password } = userData

    return Promise.all([User.findOne({ where: { account } }), User.findOne({ where: { email } })])
      .then(([accountUsed, emailUsed]) => {
        if (accountUsed) throw new Error('account 已重複註冊！')
        if (emailUsed) throw new Error('email 已重複註冊！')

        return User.create({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        })
      })
      .then(user => res.status(200).json({
        status: 'success',
        data: {
          user: user.toJSON()
        }
      })).catch(err => next(err))
  },
  putUserAccount: (req, res, next) => {
    // PUT /api/user/:id/account - 編輯註冊資料
    const { id } = req.params
    const currentUser = (helpers.getUser(req).id)
    if (id !== String(currentUser)) throw new Error('permission denied')

    const data = validateData(req.body)
    const { account, name, email, password, checkPassword } = data

    return User.findAll({ where: { [Op.or]: [{ account }, { email }] } })
      .then(users => {
        users.map(user => {
          if (user.id === currentUser) return 
          if (user.account === account ) throw new Error('account 已重複註冊！')
          if (user.email === email) throw new Error('email 已重複註冊！')
        })

        return User.update({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        }, {
          where: { id }, returning: true,
          plain: true
        })
      }).then(() => res.status(200).json({
        status: 'success'
      }))
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    // GET /api/users/:user_id - 檢視特定使用者的資訊
    const currentUser = helpers.getUser(req).dataValues
    console.log(currentUser)
    const { id } = req.params
    return User.findByPk(id, {
      include:
        [{
          model: User,
          as: 'Followings',
          attributes: ['id']
        },
        {
          model: User,
          as: 'Followers',
          attributes: ['id']
        },
        {
          model: Tweet,
          attributes: ['id']
        }
        ]
    })
      .then(user => {
        if (!user) throw new Error('帳號不存在！')
        user = {
          ...user.toJSON(),
          tweetCount: user.Tweets.length,
          followerCount: user.Followers.length,
          followingCount: user.Followings.length,
          isFollowed: user.Followers.some(u => u.id === currentUser.id)
        }

        delete user.password
        delete user.Tweets
        delete user.Followers
        res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    // GET /api/users/:user_id/tweets - 檢視特定使用者的所有推文
    const UserId = req.params.id
    return Tweet.findAll({
      where: { UserId },
      attributes: ['id','description', 'createdAt'],
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'], as: 'tweetAuthor' }, { model: Reply, attributes: ['id'] }, { model: Like, attributes: ['UserId'] }]
    })
      .then(tweets => {
        const currentUser = helpers.getUser(req)
        tweets.forEach(tweet => {
          tweet = tweet.dataValues
          tweet.replyCounts = tweet.Replies.length,
          tweet.likeCounts = tweet.Likes.length,
          tweet.isLiked = tweet.Likes.some(l => l.UserId === currentUser.id)  
          delete tweet.Replies
          delete tweet.Likes
        })
        res.status(200).json(tweets)
      }).catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    // GET /api/users/:user_id/replied_tweets - 檢視使用者發布過的所有回覆
    const UserId = req.params.id
    return Reply.findAll({
      where: { UserId },
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'], foreignKey: 'UserId', as: 'replyUser' },
      { model: Tweet, attributes: ['id', 'description'], include: [{ model: User, attributes: ['id', 'account'], as: 'tweetAuthor' }] }]
    })
      .then(replies => {
        replies.forEach(reply => {
          reply = reply.dataValues
          reply.tweetAuthorAccount = reply.Tweet.tweetAuthor.account
          delete reply.Tweet.dataValues.tweetAuthor
        })
        res.status(200).json(replies)
      }).catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    // GET /api/users/:user_id/likes - 檢視使用 like 過的所有推文
    const UserId = req.params.id
    return Like.findAll({
      where: { UserId },
      order: [['createdAt', 'DESC']],
      attributes: ['TweetId'],
      include: [{
        model: Tweet,
        attributes:
          ['id', 'description', 'createdAt'],
        include: [{
          model: User,
          attributes:
            ['id', 'account', 'name',
              'avatar'], as: 'tweetAuthor'
        }, { model: Reply }, { model: Like }]
      }]
    })
      .then(likes => {
        const currentUser = helpers.getUser(req)
        likes = likes.map(like => ({
          ...like.toJSON(),
        }))
        likes.forEach(like => {
          like.replyCounts = like.Tweet.Replies.length,
            like.likeCounts = like.Tweet.Likes.length,
            like.isLiked = like.Tweet.Likes.map(u => u.UserId).includes(currentUser.id)
          delete like.Tweet.Replies
          delete like.Tweet.Likes
        })
        return res.status(200).json(likes)
      })
      .catch(err => next(err))
  },
  getUserFollowers: (req, res, next) => {
    // GET /api/users/:user_id/followers - 檢視使用者的跟隨者
    const UserId = req.params.id
    return User.findByPk(UserId, {
      attributes: ['id',
        'name',
        'account',
        'avatar',
        'introduction'],
      include:
        [{
          model: User,
          as: 'Followers',
          attributes: ['id',
            'name',
            'account',
            'avatar',
            'introduction']
        }],
      order:
        [[sequelize.col('Followers.created_at', 'DESC')]]
    })
      .then(user => {
        const userFollowings = helpers.getUser(req).Followings.map(user => user.id)
        const followers = user.toJSON().Followers

        followers.forEach(data => {
          data.followerId = data.Followship.followerId
          data.isFollowed = userFollowings.some(id => id === data.id)
          delete data.Followship
        })
        res.status(200).json(followers)
      }).catch(err => next(err))
  },
  getUserFollowings: (req, res, next) => {
    // GET /api/users/:user_id/followings - 檢視使用的跟隨中的用戶
    const UserId = req.params.id
    return User.findByPk(UserId, {
      attributes: ['id',
        'name',
        'account',
        'avatar',
        'introduction'],
      include:
        [{
          model: User,
          as: 'Followings',
          attributes: ['id',
            'name',
            'account',
            'avatar',
            'introduction']
        }],
      order:
        [[sequelize.col('Followings.created_at', 'DESC')]]
    })
      .then(user => {
        const userFollowings = helpers.getUser(req).Followings.map(user => user.id)

        const followings = user.toJSON().Followings

        followings.forEach(data => {
          data.followingId = data.Followship.followingId
          data.isFollowed = userFollowings.some(id => id === data.id)
          delete data.Followship
        })
        res.status(200).json(followings)
      }).catch(err => next(err))
  },
  getPopularUsers: (req, res, next) => {
    // GET /api/users/popularUsers - 檢視十大熱門使用者
    const currentUser = helpers.getUser(req).id
    return User.findAll({
      include: {
        model: User, as: 'Followers', attributes: ['id']
      },
      attributes: ['id',
        'name',
        'avatar',
        'account'],
      where: { role: 'user' }
    })
      .then(users => {
        users.forEach(user => {
          user = user.dataValues
          user.followerCounts = user.Followers.length
          user.isFollowed = user.Followers.some(u => u.id === currentUser)
          delete user.Followers
        })
        users.sort((a, b) => b.followerCounts - a.followedCount).slice(0, 10)

        res.status(200).json(users)
      }).catch(err => next(err))
  },
  putUser: (req, res, next) => {
    // PUT /api/users/:user_id - 編輯個人資料
    const id = Number(req.params.id)
    const currentUser = helpers.getUser(req).id

}





module.exports = userController
