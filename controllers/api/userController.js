const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const db = require('../../models/index')
const helpers = require('../../_helpers')
const imgur = require('imgur')
const login = require('../../utils/login')

const { User, Tweet, Reply, Like, Followship } = db

module.exports = {
  getUser: async (req, res) => {
    /*  #swagger.tags = ['User']
        #swagger.description = 'user瀏覽單一使用者'
        #swagger.responses[200] = {
          description: '回傳user物件',
          schema: {"$ref": "#/definitions/UserIsSelf"}
        }
        #swagger.responses[400] = {
          description: '找不到users回傳error物件',
          schema: { status: 'error', message: '此用戶不存在。' }
        }
    */
    try {
      const { id } = req.params
      const currentUser = helpers.getUser(req)
      // get user
      let user = await User.findOne({
        //role: user or [Op.not]: [{ role: 'admin' }] both fail on test
        where: { id },
        attributes: { exclude: ['password'] },
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          Tweet
        ]
      })
      // check if user exists
      if (!user) return res.status(400).json({ status: 'error', message: '此用戶不存在。' })
      user = user.toJSON()
      user.isSelf = user.id === currentUser.id
      user.isFollowed = user.Followers.map(Follower => Follower.id).includes(currentUser.id)
      user.followerCount = user.Followers.length
      user.followingCount = user.Followings.length
      user.tweetCount = user.Tweets.length
      return res.status(200).json({ ...user, Followers: [], Followings: [], Tweets: [] })
    } catch (err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

  getTopUsers: async (req, res) => {
    /*  #swagger.tags = ['User']
        #swagger.description = '瀏覽最多追蹤者的使用者，依照追蹤數排列，排除掉已經追蹤過的使用者'
        #swagger.responses[200] = {
          description: '回傳陣列帶有多個User物件，User帶有followerCount',
          schema: [{"$ref": "#/definitions/TopUser"}]
        }
        #swagger.responses[400] = {
          description: '找不到users回傳error物件',
          schema: { status: 'error', message: '無法獲取用戶名單。' }
        }
    */
    try {
      const currentUser = JSON.parse(JSON.stringify(helpers.getUser(req)))
      const followingsOfCurrentUser = currentUser.Followings.map(Following => Following.id).concat([currentUser.id])
      let users = await User.findAll({
        where: {
          role: 'user',
          [Op.not]: [{ id: followingsOfCurrentUser }]
        },
        include: [{ model: User, as: 'Followers' }]
      })
      if (!users || !Array.isArray(users)) return res.status(400).json({ status: 'error', message: '無法獲取用戶名單。' })
      users = users.map(user => {
        user.dataValues.followerCount = user.Followers.length
        user.dataValues.isFollowed = false // since followings of current user are filtered out with Op.not
        return user
      }).sort((a, b) => b.dataValues.followerCount - a.dataValues.followerCount).splice(0, 10)
      return res.json(users)
    } catch (err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

  getTweets: async (req, res) => { // get user's posted tweets
    /*  #swagger.tags = ['User']
        #swagger.description = 'user瀏覽某一使用者發布過的所有tweets'
        #swagger.responses[200] = {
          description: '回傳陣列帶有多個Tweet物件',
          schema: [{"$ref": "#/definitions/Tweet"}]
        }
        #swagger.responses[400] = {
          description: '找不到tweets回傳error物件',
          schema: { status: 'error', message: '無法獲取此用戶的推文。' }
        }
    */
    try {
      const { id: UserId } = req.params
      // get tweets //if using raw: true with findAll, will only get one associated data
      let tweets = await Tweet.findAll({
        where: { UserId },
        include: [
          // user who posted // do we need this? It's gonna be req.params.id
          { model: User, attributes: { exclude: ['password'] } },
          // for reply count
          { model: Reply },
          // for like count
          { model: Like }
        ],
        order: [['createdAt', 'DESC']]
      })
      // check if tweets is an array
      if (!tweets || !Array.isArray(tweets)) return res.status(400).json({ status: 'error', message: '無法獲取此用戶的推文。' })
      tweets = tweets.map(tweet => {
        tweet.dataValues.isLikedByMe = tweet.Likes.map(like => like.UserId).includes(helpers.getUser(req).id)
        tweet.dataValues.isMyTweet = helpers.getUser(req).id === tweet.User.id
        tweet.dataValues.replyCount = tweet.Replies.length
        tweet.dataValues.likeCount = tweet.Likes.length
        tweet.dataValues.Replies = []
        tweet.dataValues.Likes = []
        return tweet
      })

      return res.status(200).json(tweets)
    } catch (err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

  getRepliedTweets: async (req, res) => { // get user's replied tweets
    /*  #swagger.tags = ['User']
        #swagger.description = 'user瀏覽某一使用者回應過的所有tweets'
        #swagger.responses[200] = {
          description: '回傳陣列帶有多個Reply物件',
          schema: [{"$ref": "#/definitions/RepliedTweet"}]
        }
        #swagger.responses[400] = {
          description: '找不到replies回傳error物件',
          schema: { status: 'error', message: '無法獲取此用戶回覆過的推文。' }
        }
    */
    try {
      const { id: UserId } = req.params
      // get replied tweets
      let repliedTweets = await Reply.findAll({
        where: { UserId },
        include: [
          // user who replies
          { model: User, attributes: { exclude: ['password'] } },
          { // tweet to which the reply belongs
            model: Tweet,
            include: [
              // user who posted the tweet
              { model: User, attributes: { exclude: ['password'] } },
              // for reply count
              { model: Reply },
              // for like count
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
        // helpers.getUser(req) of test file does not query anything, so we cannot search in likes array of user
        tweet.isLikedByMe = tweet.Likes.map(like => like.UserId).includes(helpers.getUser(req).id)
        tweet.isMyTweet = helpers.getUser(req).id === tweet.User.id
        tweet.replyCount = tweet.Replies.length
        tweet.likeCount = tweet.Likes.length
        tweet.Replies = []
        tweet.Likes = []
        return reply
      })

      return res.status(200).json(repliedTweets)
    } catch (err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

  getLikedTweets: async (req, res) => { // get user's liked tweets
    /*  #swagger.tags = ['User']
        #swagger.description = 'user瀏覽某一使用者喜歡過的所有tweets'
        #swagger.responses[200] = {
          description: '回傳陣列帶有多個Like物件',
          schema: [{"$ref": "#/definitions/LikedTweet"}]
        }
        #swagger.responses[400] = {
          description: '找不到likes回傳error物件',
          schema: { status: 'error', message: '無法獲取此用戶喜歡過的推文。' }
        }
    */
    try {
      const { id: UserId } = req.params
      // get liked tweets
      let likedTweets = await Like.findAll({
        where: { UserId },
        include: [
          { model: User, attributes: { exclude: ['password'] } },
          {
            model: Tweet,
            include: [
              // for reply count
              { model: Reply },
              // for like count
              { model: Like },
              // user who posted the tweet
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
        tweet.isLikedByMe = tweet.Likes.map(myLike => myLike.UserId).includes(helpers.getUser(req).id)
        tweet.isMyTweet = helpers.getUser(req).id === tweet.User.id
        tweet.replyCount = tweet.Replies.length
        tweet.likeCount = tweet.Likes.length
        tweet.Replies = []
        tweet.Likes = []
        return like
      })

      return res.status(200).json(likedTweets)
    } catch (err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

  getFollowings: async (req, res) => { // get user's followings
  /*  #swagger.tags = ['User']
      #swagger.description = 'user瀏覽某一使用者所有正在追蹤的人'
      #swagger.responses[200] = {
        description: '回傳陣列帶有多個Followship物件',
        schema: [{"$ref": "#/definitions/Following"}]
      }
      #swagger.responses[400] = {
        description: '找不到followings回傳error物件',
        schema: { status: 'error', message: '無法獲取此用戶的追蹤名單。' }
      }
  */
    try {
      const { id: followerId } = req.params
      let followings = await Followship.findAll({
        where: { followerId },
        include: [{ model: User, as: 'following', attributes: { exclude: ['password'] } }],
        order: [['createdAt', 'DESC']]
      })

      if (!followings || !Array.isArray(followings)) return res.status(400).json({ status: 'error', message: '無法獲取此用戶的追蹤名單。' })

      followings = followings.map(followship => {
        followship.dataValues.isFollowed = helpers.getUser(req).Followings.map(user => user.id).includes(followship.followingId)
        followship.dataValues.isSelf = helpers.getUser(req).id === followship.followingId
        return followship
        // if want to sort without raw: true, have to access via dataValues
      }).sort((a, b) => b.dataValues.isFollowed - a.dataValues.isFollowed)
      return res.status(200).json(followings)
    } catch (err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

  getFollowers: async (req, res) => { // get user's followers
    /*  #swagger.tags = ['User']
        #swagger.description = 'user瀏覽某一使用者所有的追蹤者'
        #swagger.responses[200] = {
          description: '回傳陣列帶有多個Followship物件',
          schema: [{"$ref": "#/definitions/Follower"}]
        }
        #swagger.responses[400] = {
          description: '找不到followings回傳error物件',
          schema: { status: 'error', message: '無法獲取此用戶的追蹤名單。' }
        }
    */
    try {
      const { id: followingId } = req.params
      let followers = await Followship.findAll({
        where: { followingId },
        include: [{ model: User, as: 'follower', attributes: { exclude: ['password'] } }],
        order: [['createdAt', 'DESC']]
      })

      if (!followers || !Array.isArray(followers)) return res.status(400).json({ status: 'error', message: '無法獲取此用戶的追隨者名單。' })

      followers = followers.map(followship => {
        followship.dataValues.isFollowed = helpers.getUser(req).Followings.map(user => user.id).includes(followship.followerId)
        followship.dataValues.isSelf = helpers.getUser(req).id === followship.followerId
        return followship
      }).sort((a, b) => b.dataValues.isFollowed - a.dataValues.isFollowed)

      return res.status(200).json(followers)
    } catch (err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

  putUser: async (req, res) => { // name, introduction, avatar, cover
    /* #swagger.tags = ['User']
      #swagger.description = '修改使用者名稱, 介紹, 大頭照, 背景照片。名稱必填'
      #swagger.parameters['description'] = {
            in: 'body',
            type: "object",
            description: "key=value: name=name&introduction=introduction&avatar=avatar&cover=cover",
            schema: {
              name: "name",
              introduction: "introduction",
              avatar: "img file",
              cover: "img file"
            },
            required: false
      }
        #swagger.responses[200] = {
          description: '回傳更新過的User物件',
          schema: {"$ref": "#/definitions/User"}
        }
      #swagger.responses[400] = {
        description: '如果使用者非本人則回傳沒有權限',
        schema: { status: 'error', message: '沒有權限修改此用戶資料。' }
      }
    */
    try {
      const { name, introduction } = req.body
      const { files } = req
      const { id } = req.params
      const currentUser = helpers.getUser(req)
      let avatar = null
      let cover = null

      // check if authorized
      if (Number(id) !== currentUser.id) return res.status(403).json({ status: 'error', message: '沒有權限修改此用戶資料。' })

      if (!name) return res.status(400).json({ status: 'error', message: '名稱是必填的!!!' })

      const updateUser = async (user, dataUpdated) => {
        if (!user) return res.status(400).json({ status: 'error', message: '無法獲取用戶資料。' })
        await user.update(dataUpdated)
        return user
      }

      // (form-data)if no req.body.avatar and req.body.cover, req.files equals undefined
      if (!files) {
        // test does not have req.files, so it will be blocked here...still need to return 200
        const user = await User.findByPk(id, { attributes: { exclude: 'password' } })
        const updatedUser = await updateUser(user, req.body)
        return res.json(updatedUser)
      }
      // //if no files attached, req.files equals [Object: null prototype] {} (truthy value), but files.avatar equals undefined
      if (files.avatar || files.cover) {
        imgur.setClientId(process.env.IMGUR_CLIENT_ID)
        if (files.avatar) {
          avatar = await imgur.uploadFile(files.avatar[0].path)
        }
        if (files.cover) {
          cover = await imgur.uploadFile(files.cover[0].path)
        }
      }
      const user = await User.findByPk(id, { attributes: { exclude: 'password' } })
      const updatedUser = await updateUser(user, {
        name,
        introduction,
        avatar: avatar ? avatar.link : user.avatar,
        cover: cover ? cover.link : user.cover
      })
      return res.status(200).json(updatedUser)
    } catch (err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

  putAccount: async (req, res) => { // account, email password, name
    /* #swagger.tags = ['User']
      #swagger.description = '修改使用者帳號, email, 密碼, 名稱。帳號、信箱、名稱必填'
      #swagger.parameters['description'] = {
        in: 'body',
        type: "object",
        description: "key=value: account=acoount&email=email&password=password&checkPassword=checkPassword&name=name",
        schema: {
          account: "account",
          email: "example@example.com",
          password: "87654321",
          checkPassword: "87654321",
          name: "Jack"
        },
        required: true
      }
    #swagger.responses[200] = {
      description: '回傳更新過的User物件',
      schema: {"$ref": "#/definitions/User"}
    }
    #swagger.responses[400] = {
      description: '如果使用者非本人則回傳沒有權限',
      schema: { status: 'error', message: '沒有權限修改此用戶資料。' }
    }
  */
    try {
      const { account, email, password, checkPassword, name } = req.body
      const { id } = req.params
      const currentUser = helpers.getUser(req)
      // check if authorized
      if (Number(id) !== currentUser.id) return res.status(403).json({ status: 'error', message: '沒有權限修改此用戶資料。' })
      if (!account || !email || !name) return res.status(400).json({ status: 'error', message: '帳戶、信箱及名稱是必填的!!!' })

      // check if account email used
      const existedAccount = await User.findOne(
        {
          where: {
            account,
            [Op.not]: [{ id: currentUser.id }]
          }
        }).catch((err) => console.log('existedAccount: ', err))

      if (existedAccount) return res.status(400).json({ status: 'error', message: '此帳號已被使用!!!', ...req.body })

      const existedEmail = await User.findOne(
        {
          where: {
            email,
            [Op.not]: [{ id: currentUser.id }]
          }
        }).catch((err) => console.log('existedAccount: ', err))

      if (existedEmail) return res.status(400).json({ status: 'error', message: '此信箱已被使用!!!', ...req.body })

      // check if password needed to be updated
      if (!password) {
        req.body.password = currentUser.password
      } else {
        if (password !== checkPassword) return res.status(400).json({ status: 'error', message: '兩次密碼輸入不同!!!', ...req.body })
        req.body.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      }

      const user = await User.findByPk(id, { attributes: { exclude: 'password' } })
      if (!user) return res.status(400).json({ status: 'error', message: '無法獲取用戶資料。' })
      const updatedAccount = await user.update(req.body) // password can be updated even it is filtered out

      return res.status(200).json(updatedAccount)
    } catch (err) {
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
      if (checkPassword !== password) return res.status(400).json({ status: 'error', message: '兩次密碼輸入不同!!!', ...req.body })
      // check if account and email used already
      const existedAccount = await User.findOne({ where: { account } }).catch((err) => console.log('existedAccount: ', err))
      if (existedAccount) return res.status(400).json({ status: 'error', message: '此帳號已被使用!!!', ...req.body })
      const existedEmail = await User.findOne({ where: { email } }).catch((err) => console.log('existedAccount: ', err))
      if (existedEmail) return res.status(400).json({ status: 'error', message: '此信箱已被使用!!!', ...req.body })
      // account hasn't been used ^__^ create user
      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(password, salt)
      const newUser = await User.create({
        account: account,
        email: email,
        password: hashedPassword,
        name: name,
        role: 'user'
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
    await login(req, res, 'user')
  }
}
