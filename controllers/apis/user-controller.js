const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../../models')
const { Op } = require("sequelize");

const userController = {
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    User.findOne( { where: { [Op.or]: [{email: req.body.email} , {account: req.body.account}] } } )
    .then(user => {
        if(user===null) user=[]
          
          if (user.account===req.body.account) throw new Error('account 已重複註冊！')
          else if (user.email===req.body.email) throw new Error('email 已重複註冊！')
        

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account:req.body.account,
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
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
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
    // let tweetsCount=0
    // let likesCount=0
    // let followerCount=0
    // let followingCount=0

    User.findByPk(req.params.id, {})
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return user
      })
      .then(user => {
      Promise.all([
      Tweet.findAll({where: {userId  } }),
      Like.findAll({ where: { userId } }),
      Followship.findAll({ where: { followerId:userId } }),
      Followship.findAll({ where: { followingId:userId } })
      ])
        .then(([tweetAll, likeAll,followerAll,followingAll]) => {
          const tweetsCount=Object.keys(tweetAll).length
          const  likesCount=Object.keys(likeAll).length
          const  followerCount=Object.keys(followerAll).length
          const  followingCount=Object.keys(followingAll).length
           console.log("===///////==",user,tweetsCount)
          //
           user=user.toJSON()
           delete user.password
        console.log("///////",tweetsCount)
        user["followersCount"] = followerCount
        user["followingCount"] = followingCount
        user["likesCount"] = likesCount
        user["tweetsCount"] = tweetsCount
           return res.json({
           status: 'success',
           message: '查詢成功！',
           ...user
         })
          //console.log("0000",likesCount,"0000")
          //console.log("00000" ,typeof(tweetAll) ,tweetAll,"00000" )
          //console.log("11111" ,typeof(likeAll) ,likeAll,"11111" )
          //return tweetsCount,likesCount,followerCount,followingCount
          })
          return user
      })
      // .then(user => {
      //   user=user.toJSON()
      //   console.log("///////",tweetsCount)
      //   user["followersCount"] = followerCount
      //   user["followingCount"] = followingCount
      //   user["likesCount"] = likesCount
      //   user["tweetsCount"] = tweetsCount
      //      return res.json({
      //      status: 'success',
      //      message: '查詢成功！',
      //      ...user
      //    })
      // })
      .catch(err => next(err))
  },

}
module.exports = userController