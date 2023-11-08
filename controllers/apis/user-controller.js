const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../../models')
const { Op } = require("sequelize");
//const { localFileHandler } = require('../../helpers/file-helpers')
const { imgurFileHandler } = require('../../helpers/file-helpers')

const userController = {
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    User.findOne({ where: { [Op.or]: [{ email: req.body.email }, { account: req.body.account }] } })
      .then(user => {
        if (user === null) user = []

        if (user.account === req.body.account) throw new Error('account 已重複註冊！')
        else if (user.email === req.body.email) throw new Error('email 已重複註冊！')


        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        role: 'user',
        password: hash
      }))
      .then((createdUser) => {
        createdUser.toJSON()
        delete createdUser.password
        delete createdUser.checkPassword
        return res.json({
          status: 'success',
          message: '註冊成功！',
          ...createdUser
        })
      })
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: (req, res, next) => {
    const userId = req.params.id

    User.findByPk(req.params.id, {})
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return user
      })
      .then(user => {
        Promise.all([
          Tweet.findAll({ where: { userId } }),
          Like.findAll({ where: { userId } }),
          Followship.findAll({ where: { followerId: userId } }),
          Followship.findAll({ where: { followingId: userId } })
        ])
          .then(([tweetAll, likeAll, followerAll, followingAll]) => {
            const tweetsCount = Object.keys(tweetAll).length
            const likesCount = Object.keys(likeAll).length
            const followerCount = Object.keys(followerAll).length
            const followingCount = Object.keys(followingAll).length
            //console.log("===///////==",user,tweetsCount)

            user = user.toJSON()
            delete user.password
            //console.log("///////",tweetsCount)
            user["followersCount"] = followerCount
            user["followingCount"] = followingCount
            user["likesCount"] = likesCount
            user["tweetsCount"] = tweetsCount
            return res.json({
              status: 'success',
              message: '查詢成功！',
              ...user
            })
          })
        return user
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {

    if (Number(req.params.id) !== Number(req.user.id)) {
      throw new Error("只能修改自己的資訊")
    }

    //check account or mail exists
    //先檢查account , mail , password 是否在req.body
    let { account, name, email, password, checkPassword, introduction } = req.body
    const { file } = req
    let passwordFlag = 0   //判斷是否有更改密碼
    if (!account) req.body.account = req.user.account
    if (!email) req.body.email = req.user.email
    //console.log("iiiii", password, "iiiii", typeof (password))
    if (password !== undefined) {
      if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
      passwordFlag = 1
    } else if (password === undefined) { passwordFlag = 0 }
    //if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    User.findOne({
      where: {
        [Op.or]: [{ email: req.body.email }, { account: req.body.account }],
        id: { [Op.ne]: req.user.id }
      }
    })
      .then(user => {
        if (user !== null) {
          if (user.account === req.body.account) throw new Error('account 已被使用！')
          else if (user.email === req.body.email) throw new Error('email 已被使用！')
        }
        //console.log("++++", password, "----", typeof (password))
        //有更新密碼就做加密 , 沒有就undefined ,不更改密碼
        var hash = (passwordFlag == 1) ? bcrypt.hash(req.body.password, 10) : Promise.resolve()
        return Promise.all([
          User.findByPk(req.params.id),
          imgurFileHandler(file),
          hash

        ])
          .then(([user, filePath, hash]) => {
            if (!user) throw new Error("User didn't exist!")

            //console.log("----", hash, "===", typeof (hash))
            return user.update({
              account: req.body.account,
              name: req.body.name,
              email: req.body.email,
              introduction: req.body.introduction,
              avatar: req.body.avatar,
              banner: filePath || req.body.banner,
              password: hash
            })
          })
          .then((user) => {
            user = user.toJSON()
            delete user.password
            return res.json({

              status: 'success',
              message: '編輯成功！',
              ...user
            })
          })
          .catch(err => next(err))

      }).catch(err => next(err))



  },

}
module.exports = userController
