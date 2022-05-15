const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Identity, Tweet, Followship, Reply, Like } = require('../../models')
const helpers = require('../../_helpers')

const userController = {
  signIn: async (req, res, next) => {
    try {
      // 登入資料錯誤希望有回傳訊息
      const userData = helpers.getUser(req)?.toJSON()
      if (userData.Identity.identity === 'admin') {
        userData.is_admin = true
      } else {
        userData.is_admin = false
      }
      delete userData.password
      delete userData.Identity
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      req.session.token = token
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

  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.passwordCheck) {
        throw new Error('驗證密碼不正確')
      }
      const user = await User.findOne({ where: { account: req.body.account } })
      if (user) throw new Error('使用者已經存在')

      const userIdentity = await Identity.findOne({
        where: { identity: 'user' },
        attributes: ['id']
      })
      const { id } = userIdentity.toJSON()

      const registeredUser = await User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        identityId: id
      })

      const token = jwt.sign(registeredUser.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      const rawUserData = await User.findByPk(registeredUser.id)
      const userData = rawUserData.toJSON()
      userData.is_admin = false
      delete userData.password

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

  getCurrentUser: (req, res, next) => {
    try {
      const userData = helpers.getUser(req)?.toJSON()
      const { token } = req.session
      if (userData.Identity.identity === 'admin') {
        userData.is_admin = true
      } else {
        userData.is_admin = false
      }
      delete userData.password
      delete userData.Identity
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

  getUser: async (req, res, next) => {
    try {
      const me = helpers.getUser(req)
      if (!me) return new Error('未存取到登入資料')
      const my = await User.findAll({
        where: { id: me.id },
        attributes: ['id', 'account', 'name'],
        include: [
          { model: User, as: 'Follower', attributes: ['id'] }
        ]
      })

      const user = await User.findAll({
        where: { id: req.params.id },
        attributes: ['id', 'account', 'name', 'email', 'coverImg', 'avatarImg', 'bio'],
        include: [
          { model: User, as: 'Follower', attributes: ['id', 'name', 'account', 'avatarImg', 'bio'] },
          { model: User, as: 'Following', attributes: ['id', 'name', 'account', 'avatarImg', 'bio'] }
        ],
        nest: true
      })
      if (!user.length) throw new Error('使用者不存在')

      const myData = JSON.parse(JSON.stringify(my))
      const userData = JSON.parse(JSON.stringify(user))
      userData[0].is_following = Boolean(
        await Followship.findOne({
          where: {
            follower_id: me.id,
            following_id: req.params.id
          }
        })
      )

      userData[0].Follower = userData[0].Follower.map(record => {
        const isFollowing = Boolean(myData[0].Follower.find(following => following.id === record.id))
        return {
          ...record,
          is_following: isFollowing
        }
      })

      userData[0].Following = userData[0].Following.map(record => {
        const isFollowing = Boolean(myData[0].Follower.find(following => following.id === record.id))
        return {
          ...record,
          is_following: isFollowing
        }
      })

      res.json(...userData)
    } catch (err) {
      next(err)
    }
  },

  getUserTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        where: { user_id: req.params.id },
        attributes: ['id', 'description', 'user_id', 'created_at', 'updated_at'],
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name']
          },
          {
            model: Reply,
            attributes: ['id']
          },
          {
            model: Like,
            attributes: ['likeUnlike']
          }
        ],
        order: [['created_at', 'DESC']],
        nest: true
      })

      if (!tweets.length) throw new Error('沒有找到相關資料')

      const data = tweets.map(tweet => {
        const replyTotal = tweet.Replies.length
        const likeTotal = tweet.Likes.filter(item => item.likeUnlike).length
        return {
          ...tweet.toJSON(),
          Replies: replyTotal,
          Likes: likeTotal
        }
      })
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },

  getUserReplies: async (req, res, next) => {
    try {
      const replies = await Reply.findAll({
        where: { user_id: req.params.id },
        attributes: ['id', 'comment', 'user_id', 'tweet_id', 'created_at', 'updated_at'],
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name']
          },
          {
            model: Tweet,
            attributes: ['id', 'description', 'user_id']
          }
        ],
        order: [['created_at', 'DESC']],
        nest: true
      })

      if (!replies.length) throw new Error('沒有找到相關資料')

      return res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },

  getUserLikes: async (req, res, next) => {
    try {
      const rawLikes = await Like.findAll({
        where: { user_id: req.params.id },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'account', 'avatar_img', 'cover_img']
          },
          {
            model: Tweet,
            attributes: ['id', 'description', 'created_at', 'updated_at'],
            include: [
              {
                model: User,
                attributes: ['id', 'name', 'account', 'avatar_img']
              },
              {
                model: Reply,
                attributes: ['tweet_id']
              },
              {
                model: Like,
                attributes: ['tweet_id']
              }
            ],
            order: [['created_at', 'DESC']]
          }
        ],
        nest: true
      })

      if (!rawLikes.length) throw new Error('沒有找到相關資料')
      const likes = JSON.parse(JSON.stringify(rawLikes))

      const data = likes.map(like => {
        const replyCount = like.Tweet.Replies.length
        like.Tweet.replyCount = replyCount
        const likeCount = like.Tweet.Likes.length
        like.Tweet.likeCount = likeCount
        return like
      })

      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },

  getUserFollowings: async (req, res, next) => {
    try {
      const rawFollowings = await Followship.findAll({
        where: { follower_id: req.params.id }
      })

      if (!rawFollowings.length) throw new Error('沒有找到相關資料')
      const followings = JSON.parse(JSON.stringify(rawFollowings))

      const me = helpers.getUser(req)?.toJSON()
      if (!me) throw new Error('未存取到登入資料')

      // for (const following of followings) {
      //   const followingUser = await User.findByPk(following.followingId, {
      //     attributes: ['id', 'name', 'account', 'bio']
      //   })
      //   following.following_user = followingUser

      //   const isFollowingRaw = await Followship.findOne({
      //     where: {
      //       follower_id: me.id,
      //       following_id: following.followingId
      //     }
      //   })
      //   following.is_following = Boolean(isFollowingRaw?.toJSON())
      Promise.all([
        User.findByPk(following.followingId, {
          attributes: ['id', 'name', 'account', 'bio']
        }),
        Followship.findOne({
          where: {
            follower_id: me.id,
            following_id: following.followingId
          }
        }).then((followingUser, isFollowingRaw) => {
          for (const following of followings) {
            following.following_user = followingUser
            following.is_following = Boolean(isFollowingRaw?.toJSON())
          }
        })
      ])

      return res.status(200).json(followings)
    } catch (err) {
      next(err)
    }
  },

  getUserFollowers: async (req, res, next) => {
    try {
      const rawFollowers = await Followship.findAll({
        where: { following_id: req.params.id }
      })

      if (!rawFollowers) throw new Error('沒有找到相關資料')
      const followers = JSON.parse(JSON.stringify(rawFollowers))

      const me = helpers.getUser(req)?.toJSON()
      if (!me) throw new Error('未存取到登入資料')

      for (const follower of followers) {
        const followedUser = await User.findByPk(follower.followerId, {
          attributes: ['id', 'name', 'account', 'bio']
        })
        follower.followed_user = followedUser

        const isFollowingRaw = await Followship.findOne({
          where: {
            follower_id: me.id,
            following_id: follower.followerId
          }
        })
        follower.is_following = Boolean(isFollowingRaw?.toJSON())
      }

      return res.status(200).json(followers)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
