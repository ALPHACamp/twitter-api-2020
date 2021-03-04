const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { sequelize } = require('../../models/index')
const db = require('../../models/index')
const helpers = require('../../_helpers')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')

module.exports = {
  getUser: async (req, res) => {
    try {
      const { id } = req.params
      //get user
      const user = await User.findOne({ 
        where: { id }, 
        attributes: { exclude: ['password'] } 
      })
      //check if user exists
      if (!user) return res.status(400).json({ status: 'error', message: '此用戶不存在。' })
      user.dataValues.isSelf = user.id === helpers.getUser(req).id
      return res.status(200).json(user)

    } catch(err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

  getTweets: async (req, res) => {
    try {
      const { id:UserId } = req.params
      //get tweets //if using raw: true with findAll, will only get one associated data
      let tweets = await Tweet.findAll({
        where: { UserId },
        nest: true,
        include: [
          //user who posted
          { model: User, attributes: { exclude: ['password'] } },
          //for reply count 
          { model: Reply },
          //for like count 
          { model: Like }
        ],
        order: [['createdAt', 'DESC']]
      })
      // check if tweets is an array
      if (!tweets || !Array.isArray(tweets)) return res.status(400).json({ status: 'error', message: '無法獲取此用戶的推文。' })
      tweets = tweets.map(tweet => {
        tweet.dataValues.isLiked = helpers.getUser(req).Likes.map(like => like.TweetId).includes(tweet.id)
        tweet.dataValues.isMyTweet = helpers.getUser(req).id === tweet.User.id
        return tweet
      })

      return res.status(200).json(tweets)

    } catch(err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

  getRepliedTweets: async (req, res) => {
    try {
      const { id:UserId } = req.params
      //get replied tweets
      let repliedTweets = await Reply.findAll({
        where: { UserId },
        nest: true,
        include: [
          //user who replies
          { model: User, attributes: { exclude: ['password'] } },
          { //tweet to which the reply belongs
            model: Tweet, 
            include: [
              //user who posted the tweet
              { model: User, attributes: { exclude: ['password'] } },
              //for reply count
              { model: Reply },
              //for like count 
              { model: Like }
            ] 
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      // check if repliedTweets is an array
      if (!repliedTweets || !Array.isArray(repliedTweets)) return res.status(400).json({ status: 'error', message: '無法獲取此用戶回覆過的推文。' })
      repliedTweets = repliedTweets.map(reply => {
        const tweet = reply.Tweet.dataValues
        tweet.isLiked = helpers.getUser(req).Likes.map(like => like.TweetId).includes(tweet.id)
        tweet.isMyTweet = helpers.getUser(req).id === tweet.User.id
        return reply
      })
      return res.status(200).json(repliedTweets)

    } catch(err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

  getLikedTweets: async (req, res) => {
    try {
      const { id:UserId  } = req.params
      //get liked tweets
      let likedTweets = await Like.findAll({
        where: { UserId },
        nest: true,
        include: [
          { model: User, attributes: { exclude: ['password'] } },
          { 
            model: Tweet, 
            include: [
              //for reply count
              { model: Reply }, 
              //for like count 
              { model: Like },
              //user who posted the tweet
              { model: User, attributes: { exclude: ['password'] } }
            ] 
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      // check if likedTweets is an array
      if (!likedTweets || !Array.isArray(likedTweets)) return res.status(400).json({ status: 'error', message: '無法獲取此用戶喜歡過的推文。' })
      likedTweets = likedTweets.map(like => {
        const tweet = like.Tweet.dataValues
        tweet.isLiked = helpers.getUser(req).Likes.map(myLike => myLike.TweetId).includes(tweet.id)
        tweet.isMyTweet = helpers.getUser(req).id === tweet.User.id
        //discard the like data part
        return tweet
      })

      return res.status(200).json(likedTweets)

    } catch(err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

  getFollowings: async (req, res) => {
    try {
      const { id:followerId  } = req.params
      let followings = await Followship.findAll({ 
        where: { followerId }, 
        include: [{ model: User, as: 'following', attributes: { exclude: ['password'] } }] 
      })

      if (!followings || !Array.isArray(followings)) return res.status(400).json({ status: 'error', message: '無法獲取此用戶的追蹤名單。' })

      followings = followings.map(followship => {
        followship.dataValues.isFollowed = helpers.getUser(req).Followings.map(user => user.id).includes(followship.followingId)
        followship.dataValues.isSelf = helpers.getUser(req).id === followship.followingId
        return followship
        //if want to sort without raw: true, have to access via dataValues
      }).sort((a, b) => b.dataValues.isFollowed - a.dataValues.isFollowed)
      return res.status(200).json(followings)

    } catch(err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

  getFollowers: async (req, res) => {
    try {
      const { id:followingId  } = req.params
      let followers = await Followship.findAll({ 
        where: { followingId }, 
        include: [{ model: User, as: 'follower', attributes: { exclude: ['password'] } }] 
      })

      if (!followers || !Array.isArray(followers)) return res.status(400).json({ status: 'error', message: '無法獲取此用戶的追隨者名單。' })

      followers = followers.map(followship => {
        followship.dataValues.isFollowed = helpers.getUser(req).Followings.map(user => user.id).includes(followship.followerId)
        followship.dataValues.isSelf = helpers.getUser(req).id === followship.followerId
        return followship
      }).sort((a, b) => b.dataValues.isFollowed - a.dataValues.isFollowed)

      return res.status(200).json(followers)

    } catch(err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

  putUser: async (req, res) => {
    try {
      const { files } = req
      const { id } = req.params
      let avatar = null
      let cover = null

      const updateUser = async (user, dataUpdated) => {
        if (!user) return res.status(400).json({ status: 'error', message: '無法獲取用戶資料。' })
        await user.update(dataUpdated)
        return user
      }

      //normally there will be keys: 'avatar' and 'cover', otherwise files equals undefined
      if (!files) {
        // return res.status(400).json({ status: 'error', message: '忘了設定 input name，avatar 跟 cover。' })
        //test does not have req.files, so it will be blocked here...still need to return 200
        const user = await User.findByPk(id, { attributes: { exclude: 'password' } })
        const updatedUser = await updateUser(user, req.body)
        return res.json(updatedUser)
      }

      // //if no files attached, req.files equals [Object: null prototype] {} (truthy value), but files.avatar equals undefined
      if (files.avatar || files.cover) {
        imgur.setClientID(process.env.IMGUR_CLIENT_ID)
        const uploadingArray = []

        const uploadFile = (fileKey) => {
          const uploadImage = new Promise((resolve, rej) => {
            //a async operation that does not return promise
            imgur.upload(files[fileKey][0].path, (err, image) => {
              if (fileKey === 'avatar') avatar = image
              if (fileKey === 'cover') cover = image
              resolve()
            })
          })
          uploadingArray.push(uploadImage)
        }

        if (files.avatar) uploadFile('avatar', avatar)
        if (files.cover) uploadFile('cover', cover)
        await Promise.all(uploadingArray)
      }

      const user = await User.findByPk(id, { attributes: { exclude: 'password' } })
      const updatedUser = await updateUser(user, {
        ...req.body,
        avatar: avatar ? avatar.data.link : user.avatar,
        cover: cover ? cover.data.link : user.cover
      })
      return res.status(200).json(updatedUser)
      
    } catch(err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

  register: async (req, res) => {
    /* #swagger.tags = ['User']
      #swagger.description = '使用者註冊'
      #swagger.parameters['description'] = {
            in: 'body',
            type: "object",
            description: "user registration data",
            schema: {
              account: 'account',
              email: 'example@example.com',
              password: '123456',
              checkPassword: '123456',
              name: 'example'
            },
            required: true
      }
        #swagger.responses[200] = {
          description: '回傳success物件',
          schema: {"$ref": "#/definitions/SuccessMessage"}
        }
      #swagger.responses[400] = {
        description: '所有欄位必填, password要等於checkPassword, 否則回傳error物件',
        schema: { status: 'error', message: '所有欄位都是必填的!!!' }
      }
    */
    const { account, email, password, checkPassword, name } = req.body
    try {
      // make sure no empty input
      if (!account || !email || !password || !checkPassword || !name) return res.status(400).json({ status: 'error', message: '所有欄位都是必填的!!!' })
      // check password confirmation
      if (checkPassword !== password) return res.status(400).json({ status: 'error', message: '兩次密碼輸入不同!!!', name, account, email, password, checkPassword })
      // check if account used already
      const existedAccount = await User.findOne({ where: { account } }).catch((err) => console.log('existedAccount: ', err))
      if (existedAccount) return res.status(400).json({ status: 'error', message: '此帳號已被使用!!!', name, account, email, password, checkPassword })
      // account hasn't been used ^__^ create user
      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(password, salt)
      const newUser = await User.create({
        account: account,
        email: email,
        password: hashedPassword,
        name: name,
        role: 'user',
        introduction: '',
        avatar: ''
      }).catch((err) => console.log('newUser: ', err))
      // if user successfully created?
      switch (!!newUser) {
        case true:
          return res.status(200).json({ status: 'success', message: '成功創建帳號!!!' })
        case false:
          return res.status(400).json({ status: 'error', message: '創建帳號失敗，請稍後再試，有任何問題請聯繫客服人員。', name, account, email, password, checkPassword })
      }
    } catch (err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。', name, account, email, password, checkPassword })
    }
  },

  login: async (req, res) => {
    /* #swagger.tags = ['User']
      #swagger.description = '使用者登入'
      #swagger.parameters['description'] = {
            in: 'body',
            type: "object",
            description: "user registration data",
            schema: {
              account: 'account',
              password: '123456',
            },
            required: true
      }
        #swagger.responses[200] = {
          description: '回傳success物件, toekn 以及user資料',
          schema: {
            "status": "success",
            "message": "成功登入!!!",
            "token": "yourToken...",
            "user": {
              "id": 11,
              "name": "Johnny1",
              "email": "user1@example.com",
              "role": "user"
            }
          }
        }
      #swagger.responses[400] = {
        description: '所有欄位必填, 帳號必須存在, 否則回傳error物件',
        schema: { status: 'error', message: '所有欄位都是必填的!!!' }
      }
    */
    const { account, password } = req.body
    try {
      // check input
      if (!account || !password) return res.status(400).json({ status: 'error', message: '所有欄位都要填!!!', account, password })
      // check if user exists
      let user = await User.findOne({ where: { account } }).catch((err) => console.log('existedAccount: ', err))
      if (!user) return res.status(400).json({ status: 'error', message: '此帳號不存在!!!', account, password })
      user = user.toJSON()
      // check if password correct
      if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ status: 'error', message: '密碼錯誤!!!', account, password })
      // sign and send jwt
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: '成功登入!!!',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      })
    } catch (err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。', account, password })
    }
  }
}
