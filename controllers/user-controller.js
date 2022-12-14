const assert = require('assert')
const bcrypt = require('bcrypt-nodejs')
const { User, Reply, Tweet, Like } = require('../models')
const { getUser } = require('../_helpers')

const userController = {
  getUser: (req, res, next) => {
    const { id } = req.params
    return User.findByPk(id, {
      include: [
        Reply, Tweet, Like,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
      nest: true
    })
      .then(user => {
        if (!user) assert(user, "User doesn't exist!")
        res.json({ status: 'success', data: user })
      })
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    const top = Number(req.query.top)
    const currentUser = getUser(req)
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: currentUser.Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
          .slice(0, top || users.length)
        res.json({ status: 'success', data: result })
      })
      .catch(err => next(err))
  },
  postUser: (req, res, next) => {
    const { account, name, email, password, confirmPassword } = req.body
    if (!account || !name || !email || !password || !confirmPassword) throw new Error('所有欄位都是必填！')
    if (password !== confirmPassword) throw new Error('密碼與密碼確認不相同！')

    Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then((user1, user2) => {
        if (user1) assert(user1, 'email 已重複註冊！')
        if (user2) assert(user2, 'account 已重複註冊！')
        return bcrypt.hashSync(password)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash
      }))
      .then(createdUser => res.json({ status: 'success', data: createdUser }))
      .catch(err => next(err))
  }
}

module.exports = userController
