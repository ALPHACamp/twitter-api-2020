const db = require('../../models')
const { User, Tweet, Like, Reply, Followship } = db
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const { Op } = require('sequelize')
const imgur = require('imgur')
const helpers = require('../../_helpers')

const userController = {
  signIn: async (req, res) => {
    try {
      if (!req.body.account || !req.body.password) {
        return res.json({ status: 'error', message: "required fields didn't exist" })
      }

      const user = await User.findOne({
        where: { account: req.body.account }
      })

      if (!user) {
        return res.status(401).json({ status: 'error', message: 'no such user found' })
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      if (user.role === 'admin') {
        return res.json({ status: 'error', message: "admin can't signin" })
      }

      const { id, name, account, email, avatar, role } = user
      const showAccount = '@' + account
      let payload = { id }
      let token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token,
        user: { id, name, account: showAccount, email, avatar, role }
      })
    }
    catch (error) {
      console.log('error:', error.message)
      return res.json({ status: 'error', message: 'codeStatus 500' })
    }
  },

  signUp: async (req, res) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account || !password || !name || !email || !checkPassword) {
        return res.json({ status: 'error', message: "required fields didn't exist" })
      }

      const user = await User.findOne({ where: { email } })

      if (user) {
        return res.json({ status: 'error', message: "this email already exists " })
      }

      const userAccount = await User.findOne({ where: { account } })

      if (userAccount) {
        return res.json({ status: 'error', message: "this account already exists " })
      }

      if (password !== checkPassword) {
        return res.json({ status: 'error', message: "password and checkPassword didn't match" })
      }

      User.create({
        account,
        name,
        email,
        role: 'user',
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })
        .then((user) => res.json({ status: 'success', message: "signup successfully" }))
        .catch((error) => res.json({ status: 'error', message: "signup fail" }))

    } catch (error) {
      console.log('error:', error.message)
      return res.json({ status: 'error', message: 'codeStatus 500' })
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findByPk(helpers.getUser(req).id)
      const { id, name, account, email, avatar, role, cover, introduction } = user
      const showAccount = '@' + account
      return res.json({ id, name, account: showAccount, email, avatar, role, cover, introduction })
    } catch (error) {
      console.log('error:', error)
      return res.json({ status: 'error', message: 'codeStatus 500' })
    }
  },

  editUser: async (req, res) => {
    try {
      const { name, account, email, password, checkPassword, introduction } = req.body

      if (email) {
        const emailExist = await User.findOne({ where: { email } })
        if (emailExist) {
          return res.json({ status: 'error', message: "this email already exists " })
        }
      }

      if (account) {
        const accountExist = await User.findOne({ where: { account } })
        if (accountExist) {
          return res.json({ status: 'error', message: "this account already exists " })
        }
      }

      let newPassword = ''
      if (password) {
        if (password !== checkPassword) {
          return res.json({ status: 'error', message: "password and checkPassword didn't match" })
        }
        newPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      }

      //上傳多張圖片
      const user = await User.findByPk(helpers.getUser(req).id)
      let coverImg = user.dataValues.cover
      let avatarImg = user.dataValues.avatar
      const { files } = req
      imgur.setClientId(process.env.IMGUR_CLIENT_ID)

      if (files) {
        if (files.cover) {
          coverImg = await imgur.uploadFile(files.cover[0].path)
          coverImg = coverImg.link
        }
        if (files.avatar) {
          avatarImg = await imgur.uploadFile(files.avatar[0].path)
          avatarImg = avatarImg.link
        }
      }

      // 更新使用者資料
      user.update({
        name,
        email,
        account,
        password: newPassword,
        introduction,
        cover: coverImg,
        avatar: avatarImg
      })
        .then((user) => {
          return res.json({ status: 'success', message: "user's profile has updated!" })
        })

    } catch (error) {
      console.log('error:', error)
      return res.json({ status: 'error', message: "user's profile updated fail!" })
    }
  },

  getUser: async (req, res) => { //取得任一使用者資料
    try {
      const id = req.params.id
      const tweets = await Tweet.count({ where: { UserId: id } })
      const user = await User.findOne({
        where: { id },
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })

      let isFollowed = false
      if (Array.isArray(helpers.getUser(req).Followings)) { // 如果helpers.getUser(req).Followings是陣列會回傳true
        isFollowed = helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }

      let introduction = null
      if (user.dataValues.introduction) {
        introduction = user.dataValues.introduction.slice(0, 49)
      }
      const tweetsNumber = tweets // 使用者推文數
      const { name, account, email, avatar, cover } = user.dataValues
      const showAccount = '@' + account
      const followingsNumber = user.dataValues.Followings.length // 使用者追蹤數
      const followersNumber = user.dataValues.Followers.length// 使用者跟隨數
      return res.json({
        id, name, account: showAccount, email, tweetsNumber, avatar, cover, introduction, followingsNumber, followersNumber, isFollowed
      })
    } catch (error) {
      console.log('error:', error)
      return res.json({ status: 'error', message: "CodeStatus 500" })
    }
  },

  getUserTweets: async (req, res) => {
    try {
      const tweet = await Tweet.findAll({
        where: { UserId: req.params.id },
        order: [['createdAt', 'DESC']],
        include: [
          Reply,
          User,
          { model: User, as: 'LikedUsers' }
        ]
      })

      const tweets = []
      tweet.map((t) => {
        let isLiked = false
        if (Array.isArray(helpers.getUser(req).LikedTweets)) {
          isLiked = helpers.getUser(req).LikedTweets.map(d => d.id).includes(t.id)// 是否按過like
        }

        const { id, description, createdAt, User, LikedUsers, Replies } = t.dataValues

        const likesNumber = LikedUsers.length   // 推文like數
        const repliesNumber = Replies.length  // 推文回覆數
        const showAccount = '@' + User.account
        return tweets.push(
          {
            id,
            description: description.slice(0, 139),
            likesNumber,
            repliesNumber,
            isLiked,
            createdAt,
            User: {
              id: User.id,
              name: User.name,
              account: showAccount,
              avatar: User.avatar
            }
          }
        )
      })
      return res.json(tweets)
    } catch (error) {
      console.log('error:', error)
      return res.json({ status: 'error', message: "CodeStatus 500" })
    }
  },

  getUserReplies: async (req, res) => {
    try {
      const reply = await Reply.findAll({
        where: { UserId: req.params.id },
        order: [['createdAt', 'DESC']],
        include: [
          Tweet,
          { model: Tweet, include: [Reply, User, { model: User, as: 'LikedUsers' }] }
        ]
      })

      const replies = []
      reply.map((r) => {
        let isLiked = false
        if (Array.isArray(helpers.getUser(req).LikedTweets)) {
          isLiked = helpers.getUser(req).LikedTweets.map(d => d.id).includes(r.id) // 是否按過like
        }

        const comment = r.dataValues.comment.slice(0, 139)
        const { id, description, createdAt, LikedUsers, Replies, User } = r.dataValues.Tweet
        const showAccount = '@' + User.account
        const likesNumber = LikedUsers.length // 推文like數
        const repliesNumber = Replies.length  // 推文回覆數
        const tweetData = {
          comment,
          tweetId: id,
          description: description.slice(0, 139),
          likesNumber,
          repliesNumber,
          isLiked,
          createdAt,
          User: {
            id: User.id,
            name: User.name,
            account: showAccount,
            avatar: User.avatar
          }
        }
        return replies.push(tweetData)
      })
      return res.json(replies)

    } catch (error) {
      console.log('error:', error)
      return res.json({ status: 'error', message: error })
    }
  },

  addFollowing: (req, res) => {
    if (Number(req.body.id) === helpers.getUser(req).id) {
      return res.json({ status: 'error', message: "can't follow yourself!" })
    }
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.body.id
    })
      .then(() => res.json({ status: 'success', message: "create followship successfully!" })
      )
      .catch((error) => {
        console.log(error)
        return res.json({ status: 'error', message: "create followship fail!" })
      })

  },

  removeFollowing: async (req, res) => {
    try {
      const followship = await Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.followingId
        }
      })

      if (!followship) {
        return res.json({ status: 'error', message: `has no followship with ${req.params.followingId}` })
      }

      followship.destroy()
        .then(() => {
          return res.json({ status: 'success', message: "remove followship successfully!" })
        })

    } catch (error) {
      console.log(error)
      return res.json({ status: 'error', message: "remove followship fail!" })
    }
  },

  getUserFollowings: (req, res) => { // 取得 :userId 的追蹤者
    User.findOne({
      where: { id: req.params.id },
      include: [{
        model: User, as: 'Followings',
        order: [['createdAt', 'DESC']]
      }]
    })
      .then((user) => {
        console.log(user)
        let followings = user.Followings.map((d) => {
          let isFollowed = false
          if (Array.isArray(helpers.getUser(req).Followings)) {
            isFollowed = helpers.getUser(req).Followings.map(f => f.id).includes(d.id)
          }

          let introduction = null
          if (d.introduction) {
            introduction = d.introduction.slice(0, 49)
          }
          const account = d.account
          const showAccount = '@' + account
          return {
            followingId: d.id,
            name: d.name,
            account: showAccount,
            avatar: d.avatar,
            introduction,
            createdAt: d.createdAt,
            isFollowed
          }
        })

        followings.sort((a, b) => b.createdAt - a.createdAt)
        return res.json(followings)
      })
      .catch((error) => {
        console.log('error:', error)
        return res.json({ status: 'error', message: "CodeStatus 500" })
      })
  },

  getUserFollowers: async (req, res) => {
    try {
      const user = await User.findOne({
        where: { id: req.params.id },
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'Followers' }]
      })

      const { Followers } = user.dataValues
      let followers = Followers.map((d) => {
        let isFollowed = false
        if (Array.isArray(helpers.getUser(req).Followings)) {
          isFollowed = helpers.getUser(req).Followings.map(f => f.id).includes(d.id)
        }
        let introduction = null
        if (d.introduction) {
          introduction = d.introduction.slice(0, 49)
        }
        const account = d.account
        const showAccount = '@' + account
        return {
          followerId: d.id,
          name: d.name,
          account: showAccount,
          avatar: d.avatar,
          introduction,
          isFollowed
        }
      })

      followers.sort((a, b) => b.createdAt - a.createdAt)
      return res.json(followers)

    } catch (error) {
      console.log('error:', error)
      return res.json({ status: 'error', message: "CodeStatus 500" })
    }
  },

  getTopUsers: async (req, res) => {
    try {
      let users = await User.findAll({
        include: [{ model: User, as: 'Followers' }], where: [{ role: { [Op.not]: 'admin' } }]
      })
      users = users.map((user) => {
        let isFollowed = false
        if (Array.isArray(helpers.getUser(req).Followings)) {
          isFollowed = helpers.getUser(req).Followings.map(f => f.id).includes(user.dataValues.id)
        }
        const showAccount = '@' + user.dataValues.account
        return {
          id: user.dataValues.id,
          name: user.dataValues.name,
          avatar: user.dataValues.avatar,
          account: showAccount,
          FollowerCount: user.Followers.length,
          isFollowed
        }
      })

      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
      return res.json({ users })
    } catch (error) {
      console.log('error:', error)
      return res.json({ status: 'error', message: "CodeStatus 500" })
    }
  },

  getUserLikes: async (req, res) => {
    try {
      let likes = await Like.findAll({
        where: { UserId: req.params.id },
        order: [['createdAt', 'DESC']],
        include: [
          Tweet,
          User,
          {
            model: Tweet, include: [Reply, User, { model: User, as: 'LikedUsers' }]
          }]
      })

      const tweets = likes.map((like) => {
        const { id, description, createdAt, LikedUsers, Replies, User } = like.dataValues.Tweet

        let isLiked = false
        if (Array.isArray(helpers.getUser(req).LikedTweets)) {
          isLiked = helpers.getUser(req).LikedTweets.map(d => d.id).includes(id)
        }
        const showAccount = '@' + User.account
        return {
          TweetId: id,
          description: description.slice(0, 139),
          likesNumber: LikedUsers.length,
          repliesNumber: Replies.length,
          isLiked,
          createdAt,
          User: { id: User.id, name: User.name, account: showAccount, avatar: User.avatar }
        }
      })
      return res.json(tweets)
    } catch (error) {
      console.log('error:', error)
      return res.json({ status: 'error', message: "CodeStatus 500" })
    }
  }
}
module.exports = userController