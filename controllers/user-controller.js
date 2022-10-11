const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const helpers = require('../_helpers')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const { en_IND } = require('faker/lib/locales')
const e = require('connect-flash')
const { captureRejectionSymbol } = require('mysql2/lib/connection')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signIn: (req, res, next) => {
    try {
      if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') {
        return res.status(403).json({ status: 'error', message: "此帳號不存在!" })
      }
      
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        },
        message: '成功登入！'
      })
      
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try{
      const { account, name, email, password, checkPassword } =req.body
      if (!account || !name || !email || !password || !checkPassword ){
       return res.status(403).json({ status: 'error', message: '所有欄位都是必填' })
      }
      if (email && !validator.isEmail(email)){
        return  res.status(403).json({ status: 'error', message: '請輸入正確信箱地址' })
     }
      if (password !== checkPassword) {
        return res.status(403).json({ status: 'error', message: '密碼與確認密碼不相符' })
      }
      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
        return  res.status(403).json({ status: 'error', message: '名稱長度不可超過50字' })
      }
      if (account && !validator.isByteLength(account, { min: 0, max: 15 })) {
        return  res.status(403).json({ status: 'error', message: '帳號長度不可超過15字' })
      }

      const [enterAccount, enterEmail] = await Promise.all([User.findOne({ where: { account } }), User.findOne({ where: { email} })])

      if(enterAccount){
        return  res.status(403).json({ status: 'error', message: '此帳號已註冊過！' })
      }
      if(enterEmail){
        return  res.status(403).json({ status: 'error', message: '此信箱已註冊過！' })
      }
      
      await User.create({
        account,
        name,
        email,
        role: 'user',
        password:bcrypt.hashSync(
          password,
          bcrypt.genSaltSync(10),
          null
        )
      })
      return res.status(200).json({
        status:'success',
        message:'註冊成功請登入！'
      })
    }
      catch(err){
        console.log(err)
    }
  },
  getCurrentUser: (req, res, next) => {

    return res.status(200).json({
      id: req.user.id,
      name: req.user.name,
      account: req.user.account,
      email: req.user.email,
      avatar: req.user.avatar,
      role: req.user.role,
      cover: req.user.cover,
      introduction: req.user.introduction
    })
  },
  editCurrentUser: async (req, res, next) => {
    try {
      const UserId = req.user.id
      const id = req.params.id
      const { account, name, email, password, checkPassword } = req.body
      const { account: currentAccount, email: currentEmail } = req.user

      if (UserId !== Number(id)) {
        return res.status(401).json({ status: 'error', message: '無法編輯其他使用者' })
      }
      if (!account || !name || !email || !password || !checkPassword) {
        return res.status(403).json({ status: 'error', message: '所有欄位都是必填' })
      }
      if (email && !validator.isEmail(email)) {
        return res.status(403).json({ status: 'error', message: '請輸入正確信箱地址' })
      }
      if (password !== checkPassword) {
        return res.status(403).json({ status: 'error', message: '密碼與確認密碼不相符' })
      }
      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
        return res.status(403).json({ status: 'error', message: '名稱長度不可超過50字' })
      }
      if (account && !validator.isByteLength(account, { min: 0, max: 15 })) {
        return res.status(403).json({ status: 'error', message: '帳號長度不可超過15字' })
      }
      
      if (account !== currentAccount) {
        const userAccount = await User.findOne({ where: { account } })
        if (userAccount) {
          return res.status(403).json({ status: 'error', message: '此帳號已有人使用！' })
        }
      }

      if (email !== currentEmail) {
        const userEmail = await User.findOne({ where: { email } })
        if (userEmail) {
          return res.status(403).json({ status: 'error', message: '此信箱已有人使用！' })
        }
      }

      let user = await User.findByPk(UserId)
      await user.update({
        account,
        name,
        email,
        password: bcrypt.hashSync(
          password,
          bcrypt.genSaltSync(10),
          null
        )
      })

      return res.status(200).json({
        status: 'success',
        message: '帳號更新成功！'
      })
    } catch (err) {
      console.log(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findOne({
        where: { id:id},
        include: [
          Tweet,
          { model: User, as: 'Followers'},
          { model: User, as: 'Followings'}
        ]
      })
      if (!user || user.role === 'admin'){
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        account: user.account,
        avatar: user.avatar,
        introduction: user.introduction,
        cover: user.cover,
        role: user.role,
        tweetCount: user.Tweets.length,
        followerCount: user.Followers.length,
        followingCount: user.Followings.length,
        isFollowed: user.Followers.map(u => u.id).includes(req.user.id)
      }
        return res.status(200).json(userData)
      }
        catch(error){
          next(error)
        }
    },
    editUser: async (req,res,next) => {
      
        const UserId = req.user.id
        const id = req.params.id
        const { name , introduction } = req.body
        if (UserId !== Number(id)) {
          return res.status(401).json({ status: 'error', message: '無法編輯其他使用者' })
        }
        if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
          return res.status(403).json({ status: 'error', message: '名稱長度不可超過50字' })
        }
        if (introduction && !validator.isByteLength(introduction, { min: 0, max: 160 })) {
          return res.status(403).json({ status: 'error', message: '自我介紹長度不可超過160字' })
        }
        const { file } = req
        return Promise.all([User.findByPk(req.params.id), imgurFileHandler(file)])
          .then(([user, filePath]) => {
            return user.update({
              name,
              introduction,
              avatar: filePath || user.avatar,
              cover: filePath || user.cover,
             })
          })
              .then(() => {
                return res.status(200).json({
                  status:'success',
                  message:'個人資料更新成功'
                }) 
              })
              .catch(err => next(err))          
    },
    getUserTweets: async (req, res, next) =>{
      try{
        const UserId = req.params.id
        const user = await User.findByPk(UserId)

        let tweets = await Tweet.findAll({
          where: { id:UserId },
          include: [
            User,
            Like,
            Reply,
            { model: User, as:'LikedUsers' }
          ],
          order: [['createdAt','DESC']]
        })
        if(!user || user.role === 'admin') {
          return res.status(404).json({ status: 'error',message:'使用者不存在'})
        }
        tweets = tweets.map(tweet => {
          return{
            id:tweet.id,
            UserId:tweet.UserId,
            description:tweet.description,
            account:tweet.User.account,
            name:tweet.User.name,
            avatar:tweet.User.avatar,
            createdAt:tweet.createdAt,
            likedCount:tweet.Likes.length,
            repliedCount:tweet.Replies.length,
            isLike: tweet.LikeUsers.map(t =>t.id).includes(req.user.id)
          }
        })
        return res.status(200).json(tweets)
      } catch(err) {
        next(err)
      }
    },
    getUserFollowers: async (req,res,next) => {

      try{
        let user = await User.findByPk(req.params.id,{
          include:[
            { model:User, as:'Followers'}
          ],
          order: [['Followers',Followship,'createdAt','DESC']]
        })
        if (!user || user.role === 'admin') {
          return res.status(404).json({ status: 'error', message: '使用者不存在' })
        }
        user = user.Followers.map(follower =>({
          followerId: follower.id,
          account: follower.account,
          name:follower.name,
          avatar: follower.avatar,
          introduction: follower.introduction,
          followshipCreatedAt: follower.Followship.createdAt,
          isFollowed: helpers.getUser(req).Followings.map(f => f.id).includes(follower.id)
        }))
        return res.status(200).json(user)
      }
        catch(err) {
          next(err)
        }
    },
    getUserFollowings: async (req,res,next) => {

      try{
        let user = await User.findByPk(req.params.id,{
          include:[
            { model:User, as:'Followings'}
          ],
          order: [['Followings', Followship, 'createdAt', 'DESC']]
        })
        if (!user || user.role === 'admin') {
          return res.status(404).json({ status: 'error', message: '使用者不存在' })
        }
        user = user.Followings.map(following => ({
          followingId: following.id,
          account: following.account,
          name: following.name,
          avatar: following.avatar,
          introduction: following.introduction,
          followshipCreatedAt: following.Followship.createdAt,
          isFollowed: helpers.getUser(req).Followings.map(f =>f.id).includes(following.id)
        }))
          return res.status(200).json(user)
      }
        catch(err){
          next(err)
        }
    },
    getUserReplies: async(req,res,next) =>{
      try{
        const UserId = req.params.id
        const user = await User.findByPk(UserId)

        let replies = await Reply.findAll({
          where: { id:UserId },
          include: [User, { model:Tweet, include:User}],
          order: [['createdAt','DESC']]
        })
        if (!user || user.role === 'admin') {
          return res.status(404).json({ status: 'error', message: '使用者不存在' })
        }
        replies = replies.map(reply => {
          return {
            replyId: reply.id,
            replyUserId: reply.UserId,
            replyComment: reply.comment,
            replyCreatedAt: reply.createdAt,
            replyAccount: reply.User.account,
            replyName: reply.User.name,
            replyAvatar: reply.User.avatar,
            tweetId: reply.Tweet.id,
            tweetDescription: reply.Tweet.description,
            tweetCreatedAt: reply.Tweet.createdAt,
            tweetAuthorAccount:reply.Tweet.User.account,
            tweetAuthorName: reply.Tweet.User.name,
            tweetAuthorAvatar: reply.Tweet.User.avatar
          }
        })
        return res.status(200).json(replies)
        }
        catch(err) {
          next(err)
        }
    },
    getUserLikes: async (req,res,next) => {
      try{
        const UserId = req.params.id
        const user = await User.findByPk(UserId)

        let likes = await Like.findAll({
          where:{id:UserId},
          include: [{
            model:Tweet,
            include: [{ model:User },{ model: Reply, include:[{ model:User}]}, Like]
          }],
          order: [['createdAt','DESC']]
        })
        if (!user || user.role === 'admin') {
          return res.status(404).json({ status: 'error', message: '使用者不存在' })
        }
        likes = likes.map(like => {
          return {
            id: like.id,
            UserId: like.UserId,
            tweetId: like.TweetId,
            likeCreatedAt: like.createdAt,
            likedTweetUserId: like.Tweet.UserId,
            name: like.Tweet.User.name,
            account: like.Tweet.User.account,
            avatar: like.Tweet.User.avatar,
            description: like.Tweet.description,
            tweetCreatedAt: like.Tweet.createdAt,
            likedCount: like.Tweet.Likes.length,
            repliedCount: like.Tweet.Replies.length,
            isLike: like.Tweet.Likes.some((t) => t.UserId === req.user.id)
          }
        })
        return res.status(200).json(likes)
      }
      catch(err){
        next(err)
      }
  },
  addFollow: (req, res, next) => {
    const { id } = req.body

    Promise.all([
      User.findByPk(id),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: id
        }
      })
    ])
      .then(([user, followship]) => {

        if (!user) throw new Error('使用者不存在')

        if (helpers.getUser(req).id === Number(id)) throw new Error('你無法追蹤自己')

        if (followship) throw new Error('你已經追蹤此使用者')


        return Followship.create({
          followerId: helpers.getUser(req).id,
          followingId: id
        })

      })
      .then(data => res.status(200).json({
        status: 'success',
        message: '追蹤中',
        data
      }))
      .catch(err => next(err))
  },
  removeFollow: (req, res, next) => {
    const { followingId } = req.params

    Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: followingId
        }
      })
    ])
      .then(([user, followship]) => {

        if (!user) throw new Error('使用者不存在')

        if (!followship) throw new Error('你未追蹤此使用者')

        return followship.destroy()

      })
      .then(data => res.status(200).json({
        status: 'success',
        message: '取消追蹤',
        data
      }))
      .catch(err => next(err))
  }
}

module.exports = userController
