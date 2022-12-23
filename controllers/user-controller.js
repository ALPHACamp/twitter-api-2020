const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')
const helpers = require('../_helpers')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { dateFormat } = require('../helpers/date-helper')
const { imgurUploadImageHandler } = require('../helpers/file-helper')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        token,
        user: userData
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account?.trim() || !name?.trim() || !email?.trim() || !password?.trim() || !checkPassword?.trim()) throw new Error('所有欄位皆為必填!')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不相符!')
    if (name?.length > 50) throw new Error('暱稱 name 上限 50 字!')
    return Promise.all([
      User.findOne({ where: { account }, raw: true }),
      User.findOne({ where: { email }, raw: true })
    ])
      .then(([userFoundByAccount, userFoundByEmail]) => {
        if (userFoundByAccount) throw new Error('account 已重複註冊!')
        if (userFoundByEmail) throw new Error('email 已重複註冊!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          account,
          name,
          email,
          password: hash
        })
      })
      .then(newUser => {
        const userData = newUser.toJSON()
        delete userData.password
        res.json({ status: 'success', message: '帳號已成功註冊!', newUser: userData })
      })
      .catch(err => next(err))
  },
  getCurrentUser: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return User.findByPk(currentUser.id, {
      attributes: {
        exclude: ['password', 'role', 'createdAt', 'updatedAt'],
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id )'), 'tweetCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id )'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id )'), 'followingCount']
        ]
      },
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        return res.json(user)
      })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    const paramsId = Number(req.params.id)
    return User.findByPk(paramsId, {
      attributes: {
        exclude: ['password', 'role', 'createdAt', 'updatedAt'],
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id )'), 'tweetCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id )'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id )'), 'followingCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE Followships.followerId = ${currentUser.id} AND Followships.followingId = User.id )`), 'isFollowed']
        ]
      },
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        return res.json(user)
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return Tweet.findAll({
      where: { UserId: req.params.id },
      include: [
        {
          model: User,
          attributes: ['id', 'account', 'name']
        }],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
        include: [
          'id', 'UserId', 'description',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id )'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id )'), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${currentUser.id} AND Likes.TweetId = Tweet.id )`), 'isLiked']
        ]
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        return tweets
          .map(tweet => ({
            ...tweet,
            relativeTime: dateFormat(tweet.createdAt).fromNow()
          }))
      })
      .then(tweets => {
        if (!tweets) throw new Error('推文不存在!')
        return res.json(tweets)
      })
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    return Reply.findAll({
      where: { UserId: req.params.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: User,
          attributes: ['id', 'account', 'name']
        },
        {
          model: Tweet,
          attributes: ['UserId'],
          include: {
            model: User,
            attributes: ['account']
          }
        }
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(replies => {
        return replies
          .map(reply => ({
            ...reply,
            relativeTime: dateFormat(reply.createdAt).fromNow()
          }))
      })
      .then(replies => {
        if (!replies) throw new Error('留言回覆不存在!')
        return res.json(replies)
      })
      .catch(err => next(err))
  },
  getUserLikedTweets: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return Like.findAll({
      where: { UserId: req.params.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: Tweet,
          attributes: [
            'id',
            'UserId',
            'description',
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id )'), 'replyCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id )'), 'likeCount'],
            [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${currentUser.id} AND Likes.TweetId = Tweet.id )`), 'isLiked']
          ],
          include: {
            model: User,
            attributes: ['id', 'account', 'name']
          }
        }
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(likes => {
        return likes
          .map(like => ({
            ...like,
            relativeTime: dateFormat(like.createdAt).fromNow()
          }))
      })
      .then(likes => {
        if (!likes) throw new Error('按讚不存在!')
        return res.json(likes)
      })
      .catch(err => next(err))
  },
  getUserFollowings: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return Followship.findAll({
      where: { followerId: req.params.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: User,
        as: 'Followings',
        attributes: {
          exclude: ['password'],
          include: [
            [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE Followships.followerId = ${currentUser.id} AND Followships.followingId = Followings.id )`), 'isFollowed']
          ]
        }
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(followships => {
        if (!followships) throw new Error('追蹤關係不存在!')
        return res.json(followships)
      })
      .catch(err => next(err))
  },
  getUserFollowers: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return Followship.findAll({
      where: { followingId: req.params.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: User,
        as: 'Followers',
        attributes: {
          exclude: ['password'],
          include: [
            [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE Followships.followerId = ${currentUser.id} AND Followships.followingId = Followers.id )`), 'isFollowed']
          ]
        }
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(followships => {
        if (!followships) throw new Error('追蹤關係不存在!')
        return res.json(followships)
      })
      .catch(err => next(err))
  },
  putUserProfile: (req, res, next) => {
    const { name, introduction } = req.body
    const id = Number(req.params.id)
    if (name?.length > 50) throw new Error('暱稱 name 上限 50 字!')
    if (introduction?.length > 160) throw new Error('自我介紹 introduction 上限 160 字!')
    const { files } = req
    return Promise.all([
      User.findByPk(id),
      imgurUploadImageHandler(files?.avatar ? files.avatar[0] : null),
      imgurUploadImageHandler(files?.cover ? files.cover[0] : null)
    ])
      .then(([user, avatarFilePath, coverFilePath]) => {
        if (!user) throw new Error('使用者不存在!')
        return user.update({
          name,
          introduction,
          avatar: avatarFilePath || user.avatar,
          cover: coverFilePath || user.cover
        })
      })
      .then(updatedUser => {
        const userData = updatedUser.toJSON()
        delete userData.password
        res.json(userData)
      })
      .catch(err => next(err))
  },
  putUserSetting: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const { account, name, email, password, checkPassword } = req.body
      const paramsId = Number(req.params.id)
      if (!account?.trim() || !name?.trim() || !email?.trim() || !password?.trim() || !checkPassword?.trim()) throw new Error('所有欄位皆為必填!')
      if (password !== checkPassword) throw new Error('密碼與確認密碼不相符!')
      if (name?.length > 50) throw new Error('暱稱 name 上限 50 字!')
      const [user, userFoundByAccount, userFoundByEmail] = await Promise.all([
        User.findByPk(paramsId),
        User.findOne({ where: { account }, raw: true }),
        User.findOne({ where: { email }, raw: true })
      ])
      // 重複的判斷方式：用req.body.account/email從資料庫篩出來的user除非是自己本人，不然req.body.account/email不能等於currentUser(本人)的account/email。換句話說，只要從資料庫篩出來的user的id跟currentUser(本人)的id不同，req.body.account/email就不能等於user(資料庫篩的)的account/email
      if ((account === userFoundByAccount?.account) && (userFoundByAccount?.id !== currentUser.id)) throw new Error('account 已重複註冊!')
      if ((email === userFoundByEmail?.email) && (userFoundByEmail?.id !== currentUser.id)) throw new Error('email 已重複註冊!')
      const renewUser = await user.update({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      const userData = renewUser.toJSON()
      delete userData.password
      res.json({ status: 'success', message: '帳號內容已成功修改!', renewUser: userData })
    } catch (error) {
      next(error)
    }
  },
  patchUserCover: (req, res, next) => {
    const id = Number(req.params.id)
    return User.findByPk(id)
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        return user.update({
          cover: 'https://i.imgur.com/dIsjVjn.jpeg' || user.cover
        })
      })
      .then(updatedUser => {
        const userData = updatedUser.toJSON()
        delete userData.password
        res.json(userData)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
