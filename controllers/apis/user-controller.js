const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const helpers = require('../../_helpers')
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

        if (user.account === req.body.account) {
          res.status(500).json({
            status: 'error',
            data: {
              'Error Message': 'account used'
            }
          })
        }
        else if (user.email === req.body.email) {
          res.status(500).json({
            status: 'error',
            data: {
              'Error Message': 'email used'
            }
          })
        }
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
        const user = createdUser.toJSON()
        delete createdUser.password
        delete createdUser.checkPassword
        return res.json({
          status: 'success',
          data: {
            ...user
          }
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
        if (!user || user.role === 'admin') res.status(500).json({
          status: 'error',
          data: {
            'Error Message': 'user not found'
          }
        })
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


            user = user.toJSON()
            delete user.password

            user["followersCount"] = followerCount
            user["followingCount"] = followingCount
            user["likesCount"] = likesCount
            user["tweetsCount"] = tweetsCount
            return res.json({
              //status: 'success',
              //data: {
              ...user
              //}
            })
          })
        return user
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {

    if (Number(req.params.id) !== Number(helpers.getUser(req).id)) {

      res.status(500).json({
        status: 'error',
        data: {
          'Error Message': '只能修改自己的資訊'
        }
      })
    }

    //check account or mail exists
    //先檢查account , mail , password 是否在req.body
    let { account, name, email, password, checkPassword, introduction } = req.body
    const { file } = req
    let passwordFlag = 0   //判斷是否有更改密碼
    //判斷是否有更改帳號或信箱 , undefined value會使條件搜尋失敗
    if (password !== undefined) {
      if (req.body.password !== req.body.checkPassword) res.status(500).json({
        status: 'error',
        data: {
          'Error Message': 'password not match'
        }
      })
      passwordFlag = 1
    } else if (password === undefined) { passwordFlag = 0 }

    let where = {}
    if (req.body.email !== undefined && req.body.account !== undefined) {
      where = {
        [Op.or]: [{ email: req.body.email }, { account: req.body.account }],
        id: { [Op.ne]: helpers.getUser(req).id }
      }
    }
    else if (req.body.email !== undefined && req.body.account === undefined) {
      where = {
        [Op.or]: [{ email: req.body.email }],
        id: { [Op.ne]: helpers.getUser(req).id }
      }
    }
    else if (req.body.email === undefined && req.body.account !== undefined) {
      where = {
        [Op.or]: [{ account: req.body.account }],
        id: { [Op.ne]: helpers.getUser(req).id }
      }
    }
    else {
      where = {
        id: { [Op.ne]: helpers.getUser(req).id }
      }
    }

    User.findOne({
      where

    })
      .then(user => {

        if (user !== null) {

          if (user.account === req.body.account) res.status(500).json({
            status: 'error',
            data: {
              'Error Message': 'account used'
            }
          })
          else if (user.email === req.body.email) res.status(500).json({
            status: 'error',
            data: {
              'Error Message': 'email used'
            }
          })
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
            if (!user) res.status(500).json({
              status: 'error',
              data: {
                'Error Message': 'user not exist'
              }
            })

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
            const user1 = user.toJSON()

            delete user1.password
            //return user1 -->this will lead to internal errror
            return res.json({

              status: 'success',
              data: { ...user1 }

            })
          })
          .catch(err => next(err))

      }).catch(err => next(err))



  },
  getUserTweets: (req, res, next) => {
    const userId = req.params.id
    return Tweet.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    }).then((tweets) => {
      return res.json(
        tweets
      )
    }).catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    const userId = req.params.id
    return Reply.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    }).then((replies) => {
      return res.json(
        replies
      )
    }).catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {

    const userId = req.params.id
    return Like.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    }).then((likes) => {
      return Promise.all(
        likes.map(item => {
          return Promise.all([
            Tweet.findOne({
              where: { id: item.TweetId }, raw: true, nest: true
            }),
            User.findOne({
              where: { id: item.UserId }, raw: true, nest: true
            }),
            Like.findAll({
              where: { TweetId: item.TweetId }, raw: true, nest: true
            }),
            Reply.findAll({
              where: { TweetId: item.TweetId }, raw: true, nest: true
            }),
          ])
            .then(([TweetOne, UserOne, LikeAll, ReplyAll]) => {

              let likesCount = Object.keys(LikeAll).length
              let repliesCount = Object.keys(ReplyAll).length

              item["likesCount"] = likesCount
              item["repliesCount"] = repliesCount

              let description = TweetOne.description
              let name = UserOne.name
              let account = UserOne.account
              let avatar = UserOne.avatar

              item["description"] = description
              item["name"] = name
              item["account"] = account
              item["avatar"] = avatar

              return item

            }).catch(err => next(err))

        })
      )

    }
    ).then(response => {

      return res.json(
        response
      )
    })

      .catch(err => next(err))
  },


}
module.exports = userController
