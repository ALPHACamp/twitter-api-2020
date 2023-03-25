const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const db = require('../models')
const { User, sequelize, Tweet, Reply, Like, Followship } = db

const adminServices = {
  postSignIn: (req, cb) => {
    const userData = helpers.getUser(req).toJSON()
    delete userData.password
    try {
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, {
        status: 'success',
        message: '成功登入',
        data: {
          token,
          userData
        }
      })
    } catch (err) {
      cb(err)
    }
  },
  getTopUsers: (next, cb) => {
    try {
      User.findAll({
        where: { role: 'user' },
        attributes: {
          include: [
            [
              sequelize.literal('(SELECT COUNT(*)FROM Tweets WHERE User_id = User.id)'), 'TweetsCounts'
            ],
            [
              sequelize.literal('(SELECT COUNT(*)FROM Followships AS Followers WHERE following_id = User.id)'), 'followerCounts'
            ],
            [
              sequelize.literal('(SELECT COUNT(*)FROM Followships AS Followings WHERE follower_id = User.id)'), 'followingCounts'
            ],
            [
              sequelize.literal('(SELECT COUNT(*)FROM Likes INNER JOIN Tweets ON Tweets.id = Likes.tweet_id WHERE Tweets.User_id = User.id)'), 'LikedCounts'
            ]
          ],
          exclude: [
            'introduction',
            'password',
            'updatedAt',
            'createdAt'
          ]
        },
        order: [
          [sequelize.literal('followerCounts'), 'DESC']
        ]
      })
        .then(users => cb(null, {
          status: 'success',
          data: {
            usersData: [...users]
          }
        }))
    } catch (err) {
      next(err)
    }
  },
  postSignUp: (req, cb) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !email || !password || !checkPassword) throw new Error('請填寫必填欄位')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不相符')
    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('此信箱已被註冊')
        return User.create({
          account,
          name,
          email,
          password,
          role: 'user'
        })
          .then(user => {
            const userData = user.toJSON()
            delete userData.password
            const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
            return cb(null, {
              status: 'success',
              message: '成功註冊',
              data: {
                token,
                userData
              }
            })
          })
      })
      .catch(err => cb(err))
  },
  getUserFailed: (req, cb) => {
    const { id } = req.params
    User.findAll({
      where: {
        id: id,
        role: 'user'
      }
    }, {
      attributes: {
        include: [
          [
            sequelize.literal('(SELECT COUNT(*)FROM Tweets WHERE User_id = User.id)'), 'TweetsCounts'
          ],
          [
            sequelize.literal('(SELECT COUNT(*)FROM Followships AS Followers WHERE following_id = User.id)'), 'followerCounts'
          ],
          [
            sequelize.literal('(SELECT COUNT(*)FROM Followships AS Followings WHERE follower_id = User.id)'), 'followingCounts'
          ],
          [
            sequelize.literal('(SELECT COUNT(*)FROM Likes INNER JOIN Tweets ON Tweets.id = Likes.tweet_id WHERE Tweets.User_id = User.id)'), 'LikedCounts'
          ]
        ],
        exclude: [
          'password',
          'updatedAt',
          'createdAt'
        ]
      },
      raw: true
    })
      .then(user => {
        cb(null, user[0])
      })
      .catch(err => cb(err))
  },
  getUserTweets: (req, cb) => {
    return Tweet.findAll({
      where: { UserId: req.params.id },
      include: [{ model: User, as: 'Author', attributes: ['id', 'account', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        // tweets = tweets.map(tweet => { return tweet })
        return cb(null, [...tweets])
      })
      .catch(err => cb(err))
  },
  getUserRepliedTweets: (req, cb) => {
    return Reply.findAll({
      where: { UserId: req.params.id },
      include: {
        model: Tweet,
        attributes: [
          'id',
          'description',
          'createdAt']
      },
      order: [['createdAt', 'desc']]
    }).then(replies => {
      return cb(null, [...replies])
    })
      .catch(err => cb(err))
  },
  getUserLikedTweets: (req, cb) => {
    return Like.findAll({
      where: { UserId: req.params.id },
      include: [
        {
          model: Tweet,
          as: 'likedTweet',
          include: [
            { model: User, as: 'Author', attributes: ['id', 'account', 'name', 'avatar'] }
          ]
        }
      ],
      order: [['createdAt', 'desc']]
    }).then(replies => {
      return cb(null, [...replies])
    })
      .catch(err => cb(err))
  },
  getUserFollowings: (req, cb) => {
    return Followship.findAll({
      where: { followerId: req.params.id },
      include: [
        { model: User, as: 'Follower', attributes: ['id', 'account', 'name', 'avatar'] }
      ]
    }).then(followings => {
      return cb(null, [...followings])
    }).catch(err => cb(err))
  },
  getUserFollowers: (req, cb) => {
    return Followship.findAll({
      where: { followingId: req.params.id },
      include: [
        { model: User, as: 'Following', attributes: ['id', 'account', 'name', 'avatar'] }
      ]
    }).then(followers => {
      return cb(null, [...followers])
    }).catch(err => cb(err))
  },
  putUserSetting: (req, cb) => {
    const id = Number(req.params.id)
    // console.log(helpers.getUser(req))
    const currentUserId = helpers.getUser(req).id
    const { name, email, introduction, avatar, cover, password, checkPassword } = req.body

    // if (password !== checkPassword) throw new Error('密碼與確認密碼不相符')
    if (id !== currentUserId) throw new Error('您沒有權限編輯此使用者資料')
    // if (!name || !email || !password || !checkPassword) throw new Error('請填寫必填欄位')

    return User.findByPk(currentUserId)
      .then(user => {
        user.update({
          name,
          email,
          introduction,
          password,
          avatar,
          cover
        })
          .then(user => {
            const userData = user.toJSON()
            delete userData.password
            const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
            return cb(null, { token, userData })
          })
      })
      .catch(err => cb(err))
  },
  putUserProfile: (req, cb) => {
  }
}
module.exports = adminServices
