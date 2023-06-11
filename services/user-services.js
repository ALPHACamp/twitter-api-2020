const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const { getUser } = require('../_helpers.js')
const userServices = {
  signUp: (req, cb) => {
    const { name, account, email, password, checkPassword } = req.body
    // check if password equals checkPassword
    if (password !== checkPassword) throw new Error('第二次輸入密碼有誤')
    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([user1, user2]) => {
        if (user1) {
          throw new Error('account 已重複註冊！')
        }
        if (user2) {
          throw new Error('email 已重複註冊！')
        }
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          name,
          account,
          email,
          password: hash,
          role: 'user'
        })
      })
      .then(() => cb(null))
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
      nest: true
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在')
        const data = {
          ...user.toJSON(),
          Follower_count: user.Followers.length,
          Following_count: user.Followers.length,
          isFollowed: user.Followers.some(f => f.id === req.user.id)
        }
        delete data.password
        delete data.role
        delete data.createdAt
        delete data.updatedAt
        delete data.Followers
        delete data.Followings
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  getUserTweets: (req, cb) => {
    return Tweet.findAll({
      where: { UserId: req.params.id },
      order: [['createdAt', 'DESC']],
      include: [User, Reply, Like]
    })
      .then(tweets => {
        tweets = tweets.map(tweet => {
          tweet = {
            ...tweet.toJSON(),
            isLiked: tweet.Likes.map(like => like.UserId).includes(req.user.id),
            replyCount: tweet.Replies.length,
            likedCount: tweet.Likes.length,
            name: tweet.User.name,
            avatar: tweet.User.avatar,
            account: tweet.User.account
          }
          delete tweet.Replies
          delete tweet.Likes
          delete tweet.User
          return tweet
        })
        return cb(null, tweets)
      })
      .catch(err => cb(err))
  },
  getUserRepliedTweets: (req, cb) => {
    return Reply.findAll({
      where: { UserId: req.params.id },
      order: [['createdAt', 'DESC']],
      include: [User, Tweet]
    })
      .then(replies => {
        replies = replies.map(reply => {
          reply = {
            ...reply.toJSON(),
            name: reply.User.name,
            avatar: reply.User.avatar,
            account: reply.User.account
          }
          delete reply.User
          delete reply.Replies
          delete reply.Likes
          return reply
        })
        return cb(null, replies)
      })
      .catch(err => cb(err))
  },
  getUserLikesTweets: (req, cb) => {
    return Like.findAll({
      where: { UserId: req.params.id },
      include: [User,
        { model: Tweet, include: [Reply, Like, User] }
      ],
      order: [['createdAt', 'DESC']],
      nest: true
    })
      .then(likes => {
        const tweets = likes.map(l => {
          l = {
            TweetId: l.TweetId,
            description: l.Tweet.description,
            isLiked: true,
            reply_count: l.Tweet.Replies.length,
            like_count: l.Tweet.Likes.length,
            tweet_user_data: {
              name: l.Tweet.User.name,
              avatar: l.Tweet.User.avatar,
              account: l.Tweet.User.account
            }
          }
          delete l.User
          delete l.twitter
          return l
        })
        return cb(null, tweets)
      })
      .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    try {
      const { name, introduction } = req.body
      const { files } = req
      if (introduction.length > 160) throw new Error('自我介紹字數超出上限160字！')
      if (name.length > 50) throw new Error('暱稱字數超出上限50字！')
      return User.findByPk(req.params.id)
        .then(user => {
          if (JSON.stringify(files) !== '{}' && files !== undefined) {
            return Promise.all([
              imgurFileHandler(files.coverPhoto[0]),
              imgurFileHandler(files.avatar[0])
            ])
              .then(([coverFilePath, avatarFilePath]) => {
                return user.update({
                  name,
                  avatar: avatarFilePath || user.avatar,
                  coverPhoto: coverFilePath || user.coverPhoto,
                  introduction
                })
              })
          } else {
            return user.update({
              name,
              introduction
            })
          }
        })
        .then(updatedUser => {
          cb(null, {
            status: 'success',
            message: '操作成功',
            data: {
              avatar: updatedUser.avatar,
              coverPhoto: updatedUser.coverPhoto,
              name: updatedUser.name,
              introduction: updatedUser.introduction
            }
          })
        })
    } catch (err) {
      cb(err)
    }
  },
  putAccount: (req, cb) => {
    const { name, account, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('第二次輸入密碼有誤')
    if (name.length > 50) throw new Error('暱稱字數超出上限50字！')
    return User.findAll({
      where: {
        [Op.or]: [
          { email },
          { account }
        ]
      },
      attributes: ['account', 'email', 'id'],
      raw: true,
      nest: true
    })
      .then(user => {
        // check if email or account already used by user other than login user
        if (user.some(u => u.email === email && u.id !== req.user.id)) throw new Error('信箱已被註冊')
        if (user.some(u => u.account === account && u.id !== req.user.id)) throw new Error('帳號已被註冊')
        return User.findByPk(req.params.id)
      })
      .then(user => {
        return user.update({
          name,
          account,
          email,
          password: bcrypt.hashSync(password, 10)
        })
      })
      .then(() => {
        cb(null, {
          status: 'success',
          message: '操作成功'
        })
      })
      .catch(err => cb(err))
  },
  getFollowers: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [{
          model: User,
          as: 'Followers',
          attributes: ['id', 'name', 'avatar', 'introduction']
        }]
      }),
      Followship.findAll({
        where: { followerId: getUser(req).dataValues.id },
        raw: true
      })
    ])
      .then(([user, followings]) => {
        if (!user.Followers.length) return cb(null, [])
        const currentFollowings = followings.map(f => f.followingId)
        const followers = user.Followers.map(f => ({
          followerId: f.id,
          account: f.account,
          name: f.name,
          introduction: f.introduction,
          isFollowed: currentFollowings.some(id => id === f.id)
        }))
        return cb(null, followers)
      })
      .catch(err => cb(err))
  },
  getFollowings: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [{
          model: User,
          as: 'Followings',
          attributes: ['id', 'name', 'avatar', 'introduction']
        }]
      }),
      Followship.findAll({
        where: { followerId: getUser(req).dataValues.id },
        raw: true
      })
    ])
      .then(([user, userFollowings]) => {
        if (!user.Followings.length) return cb(null, [])
        const currentFollowings = userFollowings.map(f => f.followingId)
        const followings = user.Followings.map(f => ({
          followingId: f.id,
          account: f.account,
          name: f.name,
          introduction: f.introduction,
          isFollowed: currentFollowings.some(id => id === f.id)
        }))
        return cb(null, followings)
      })
      .catch(err => cb(err))
  },
  getTopTenUsers: (req, cb) => {
    Promise.all([
      User.findAll({
        include: [
          Tweet,
          Like,
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Followship.findAll({
        where: { followerId: getUser(req).dataValues.id },
        raw: true
      })
    ])
      .then(([users, userFollowings]) => {
        const currentFollowings = userFollowings.map(f => f.followingId)
        const userData = users.map(user => {
          const data = {
            ...user.toJSON(),
            followerCounts: user.Followers.length,
            followingCounts: user.Followings.length,
            tweetCounts: user.Tweets.length,
            likeCounts: user.Likes.length,
            isFollowed: currentFollowings.some(id => id === user.id)
          }
          delete data.password
          delete data.role
          delete data.introduction
          delete data.Tweets
          delete data.Likes
          delete data.Followers
          delete data.Followings
          return data
        })
          .sort((a, b) => b.followerCounts - a.followerCounts)
          .slice(0, 10)
        return cb(null, userData)
      })
      .catch(err => cb(err))
  }
}

module.exports = userServices
