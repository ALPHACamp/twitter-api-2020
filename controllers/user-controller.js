
const bcrypt = require('bcryptjs')
const Op = require('../models').Sequelize.Op
const { imgurFileHandler } = require('../helpers/file-helper')
const { User, Followship, Tweet, Like, Reply, sequelize } = require('../models')
const jwtHelpers = require('../helpers/bearer-token-helper')
const authHelpers = require('../_helpers')
const jwt = require('jsonwebtoken')
const {
  putUserCheck,
  putUserSettingCheck,
  postUsersFormDataCheck
} = require('../helpers/formdata-check-helper')


const BCRYPT_COMPLEXITY = 10

const userController = {
  login: (req, res, next) => {
    const error = new Error()
    const { account, password } = req.body

    if (!account || !password) {
      error.code = 400
      error.message = '所有欄位都要填寫'
      return next(error)
    }

    return User.findOne({ where: { account } })
      .then(user => {
        if (!user || user.role === 'admin') {
          error.code = 403
          error.message = '帳號不存在'
          return next(error)
        }

        return Promise.all([
          bcrypt.compare(password, user.password),
          user
        ])
      })
      .then(([isMatched, user]) => {
        if (!isMatched) {
          error.code = 403
          error.message = '帳號或密碼錯誤'
          return next(error)
        }

        const userData = user.toJSON()
        delete userData.password
        const token = jwt
          .sign(
            userData,
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
          )
        return res.json({
          status: 'success',
          token,
          data: userData

        })
      })
      .catch(error => {
        error.code = 500
        return next(error)
      })
  },
  postUsers: async (req, res, next) => {

    try {
      const { name, account, email, password } = req.body
      const message = await postUsersFormDataCheck(req)

      if (message) {
        return res
          .status(200)
          .json({ code: 400, status: 'error', message, data: req.body })
      }

      const user = await User.create({
        name,
        account,
        email,
        password: bcrypt.hashSync(password, BCRYPT_COMPLEXITY),
        role: "user",
        avatar: "https://res.cloudinary.com/dqfxgtyoi/image/upload/v1646039874/twitter/project/defaultAvatar_a0hkxw.png",
        cover: "https://res.cloudinary.com/dqfxgtyoi/image/upload/v1646039858/twitter/project/defaultCover_rx9g6m.jpg",
        introduction: ""
      })
      const result = user.toJSON()
      delete result.password

      return res
        .status(200)
        .json({ status: 'success', message: '註冊成功', data: user.toJSON() })
    } catch (error) {
      error.code = 500
      return next(error)
    }
  },
  getUser: async (req, res, next) => {
    try {

      const error = new Error()
      const targetUserId = (req.params.id)

      if (isNaN(targetUserId) || !(await User.findByPk(targetUserId))) {
        error.code = 404
        error.message = '對應使用者不存在'
        return next(error)
      }

      const user = await User.findByPk(targetUserId, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ],
        attributes: { exclude: ['password'] }
      })
      const followedUsers = authHelpers.getUser(req).Followings
      user.dataValues.isFollowed = followedUsers.some(fu => fu.id === user.id)

      return res.json(user)
    } catch (err) {
      next(err)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      const user = authHelpers.getUser(req)
      const users = await User.findAll({
        where: {
          id: {
            [Op.ne]: user.id
          },
          role: 'user'
        },
        include: [{ model: User, as: 'Followers', attributes: { exclude: ['password'] } }],
        attributes: [
          'id',
          'name',
          'avatar',
          'account',
          'followerCount'
        ],
        order: [[sequelize.literal('followerCount'), 'DESC']],
        limit: 10
      })

      const followedUsers = authHelpers.getUser(req).Followings

      const results = users.map(u => ({
        ...u.toJSON(),
        isFollowed: followedUsers.some(fu => fu.id === u.id)
      }))

      return res.json({ status: 'success', message: '成功獲取', data: results })
    } catch (err) {
      next(err)
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const userId = authHelpers.getUser(req).id

      const currentUser = await User.findByPk(userId, {
        attributes: [
          'id',
          'account',
          'email',
          'name',
          'avatar',
          'role',
          'cover',
          'followerCount',
          'followingCount',
          'tweetCount'
        ]
      })
      currentUser.dataValues.isExpiredToken = jwtHelpers.identifyJWT(req)
      return res.json({ status: 'success', message: '成功獲取', data: currentUser })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {

      const error = new Error()
      const targetUserId = req.params.id
      const loginUserId = authHelpers.getUser(req).id

      if (isNaN(targetUserId) || !(await User.findByPk(targetUserId))) {
        error.code = 404
        error.message = '對應使用者不存在'
        return next(error)
      }

      const tweets = await Tweet.findAll({
        where: { UserId: targetUserId },
        attributes: [
          'id',
          'UserId',
          'description',
          'createdAt',
          'updatedAt',
          'likeCount',
          'replyCount',
          [
            sequelize.literal(
              `EXISTS (SELECT 1 FROM Likes WHERE UserId = ${loginUserId} AND TweetId = Tweet.id)`
            ),
            'isLiked',
          ],
          [
            sequelize.literal(
              `EXISTS (SELECT 1 FROM Replies WHERE UserId = ${loginUserId} AND TweetId = Tweet.id)`
            ),
            'isReplied'
          ]
        ],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'], as: 'TweetAuthor' }
        ],
        order: [['createdAt', 'DESC']]
      })


      const results = tweets.map(t => {
        t = t.toJSON()
        t.isLiked = Boolean(t.isLiked)
        t.isReplied = Boolean(t.isReplied)
        return t
      })

      return res.json([...results])
    } catch (err) {
      next(err)
    }

  },
  putUserSetting: async (req, res, next) => {
    try {
      const error = new Error()
      const loginUserId = authHelpers.getUser(req).id
      let targetUserId = req.params.id


      if (isNaN(targetUserId) || !(await User.findByPk(targetUserId))) {
        error.code = 404
        error.message = '對應使用者找不到'
        return next(error)
      }

      targetUserId = Number(targetUserId)

      if (targetUserId !== loginUserId) {
        error.code = 400
        error.message = '只能修改自己的資料'
        return next(error)
      }


      const { name, account, email, password } = req.body
      const message = await putUserSettingCheck(req)

      if (message) {
        return res
          .status(200)
          .json({ code: 400, status: 'error', message, data: req.body })
      }


      await User.update({
        name,
        account,
        email,
        password: bcrypt.hashSync(password, BCRYPT_COMPLEXITY)
      }, { where: { id: targetUserId } })

      const result = { name, account, email }

      return res
        .status(200)
        .json({ status: 'success', message: '修改成功', data: result })
    } catch (error) {
      error.code = 500
      return next(error)
    }

  },
  putUser: async (req, res, next) => {
    try {
      const error = new Error()
      let targetUserId = req.params.id
      const loginUserId = authHelpers.getUser(req).id
      const DEL_OPERATION_CODE = '-1'

      // 測試檔要求
      const user = !isNaN(targetUserId) && await User.findByPk(targetUserId)

      if (!user) {
        error.code = 404
        error.message = '對應使用者找不到'
        return next(error)
      }

      targetUserId = Number(targetUserId)

      if (targetUserId !== loginUserId) {
        error.code = 400
        error.message = '只能修改自己的資料'
        return next(error)
      }


      const { name, introduction, cover, avatar } = req.body
      const { files } = req

      const message = await putUserCheck(req)
      if (message) {
        return res
          .status(200)
          .json({ code: 400, status: 'error', message, data: req.body })
      }

      let uploadAvatar = ''
      let uploadCover = ''

      if (cover === DEL_OPERATION_CODE) {
        uploadCover = 'https://res.cloudinary.com/dqfxgtyoi/image/upload/v1646039858/twitter/project/defaultCover_rx9g6m.jpg'
      } else {
        uploadCover = files && files.cover ?
          await imgurFileHandler(files.cover[0]) :
          user.cover
      }

      if (avatar === DEL_OPERATION_CODE) {
        uploadAvatar = 'https://res.cloudinary.com/dqfxgtyoi/image/upload/v1646039874/twitter/project/defaultAvatar_a0hkxw.png'
      } else {
        uploadAvatar = files && files.avatar ?
          await imgurFileHandler(files.avatar[0]) :
          user.avatar
      }

      await user.update({
        name,
        introduction,
        avatar: uploadAvatar,
        cover: uploadCover
      })

      const results = {
        account: user.account,
        name,
        introduction,
        avatar: uploadAvatar,
        cover: uploadCover
      }


      return res
        .status(200)
        .json({ status: 'success', message: '修改成功', data: results })
    } catch (error) {
      error.code = 500
      return next(error)
    }
  },
  // 獲取指定使用者所追隨的使用者清單
  getFollowings: async (req, res, next) => {
    try {
      const error = new Error()
      const loginUserId = authHelpers.getUser(req).id
      const targetUserId = req.params.id

      // 找不到使用者可以調閱他/她追隨的使用者清單
      if (isNaN(targetUserId) || !(await User.findByPk(targetUserId))) {
        error.code = 404
        error.message = '對應使用者不存在'
        return next(error)
      }

      // 目前使用者調閱他人所追隨的使用者清單
      // (含暱稱/名稱、帳號、頭像、封面、自我介紹、它所追蹤的人是否也被目前使用者追蹤)
      // 按追隨紀錄排序，由新至舊
      const findOption = {
        include: [
          {
            model: User,
            as: 'Followings',
            attributes: [
              ['id', 'followingId'],
              'name', 'account', 'introduction',
              'cover', 'avatar',
              [
                sequelize.literal(`
                  EXISTS (
                      SELECT 1 FROM Followships
                      WHERE followerId = ${loginUserId} 
                      AND followingId = Followings.id
                    )
                `),
                'isFollowed'
              ]
            ]
          }
        ],
        attributes: [],
        order: [
          [sequelize.literal('`Followings->Followship`.`createdAt`'), 'DESC']
        ]
      }
      const followingUsers = await User.findByPk(targetUserId, findOption)

      const result = followingUsers.toJSON().Followings

      result.forEach(fu => {
        fu.isFollowed = Boolean(fu.isFollowed)
      })

      return res
        .status(200)
        .json(result)
    } catch (error) {
      // 系統出錯
      error.code = 500
      return next(error)
    }
  },
  // 獲取指定使用者的被跟隨之使用者清單
  getFollowers: async (req, res, next) => {
    try {
      const error = new Error()
      const loginUserId = authHelpers.getUser(req).id
      const targetUserId = req.params.id

      // 找不到使用者可以調閱他/她的被跟隨之使用者清單
      if (isNaN(targetUserId) || !(await User.findByPk(targetUserId))) {
        error.code = 404
        error.message = '對應使用者不存在'
        return next(error)
      }

      // 目前使用者調閱另一個使用者X的跟隨者清單
      // (含暱稱/名稱、帳號、頭像、封面、自我介紹、它所追蹤的人是否也被目前使用者追蹤)
      // 按追隨紀錄排序，由新至舊
      const findOption = {
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: [
              ['id', 'followerId'],
              'name', 'account', 'introduction',
              'cover', 'avatar',
              [
                sequelize.literal(`
                  EXISTS (
                      SELECT 1 FROM Followships
                      WHERE followerId = ${loginUserId} 
                      AND followingId = Followers.id
                    )
                `),
                'isFollowed'
              ]
            ]
          }
        ],
        attributes: [],
        order: [
          [sequelize.literal('`Followers->Followship`.`createdAt`'), 'DESC']
        ]
      }
      const followerUsers = await User.findByPk(targetUserId, findOption)

      const result = followerUsers.toJSON().Followers

      result.forEach(fu => {
        fu.isFollowed = Boolean(fu.isFollowed)
      })

      return res
        .status(200)
        .json(result)


    } catch (error) {
      // 系統出錯
      error.code = 500
      return next(error)
    }
  },
  // 獲取對應使用者所喜歡的推文之清單
  getLikes: async (req, res, next) => {
    try {
      const error = new Error()
      const loginUserId = authHelpers.getUser(req).id
      const targetUserId = req.params.id

      // 找不到使用者可以調閱他/她的喜歡推文清單
      if (isNaN(targetUserId) || !(await User.findByPk(targetUserId))) {
        error.code = 404
        error.message = '對應使用者不存在'
        return next(error)
      }

      // 目前使用者調閱另一個使用者X的喜歡推文清單
      // (含暱稱/名稱、帳號、頭像、封面、它所喜歡的推文是否也被目前使用者喜歡和回覆)
      // (時間、推文內容等)
      // 按喜歡紀錄排序，由新至舊
      const findOption = {
        where: {
          UserId: targetUserId
        },
        include: [
          {
            model: Tweet,
            as: 'LikedTweet',
            attributes: [
              'id', 'UserId', 'description', 'createdAt',
              'updatedAt', 'replyCount', 'likeCount',
              [
                sequelize.literal(`
                  EXISTS (
                      SELECT 1 FROM Likes
                      WHERE UserId = ${loginUserId} 
                      AND TweetId = LikedTweet.id
                    )
                `),
                'isLiked'
              ],
              [
                sequelize.literal(`
                  EXISTS (
                      SELECT 1 FROM Replies
                      WHERE UserId = ${loginUserId} 
                      AND TweetId = LikedTweet.id
                    )
                `),
                'isReplied'
              ]
            ],
            include: [
              {
                model: User,
                as: 'TweetAuthor',
                attributes: [
                  'id', 'account', 'name', 'email',
                  'avatar', 'cover'
                ]
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      }
      const LikedTweets = await Like.findAll(findOption)
      const results = LikedTweets.map(lt => {
        lt = lt.toJSON()
        lt.LikedTweet.isLiked = Boolean(lt.LikedTweet.isLiked)
        lt.LikedTweet.isReplied = Boolean(lt.LikedTweet.isReplied)
        return lt
      })

      return res.json(results)
    } catch (error) {
      // 系統出錯
      error.code = 500
      return next(error)
    }
  },
  // 獲取對應使用者所回覆的推文之清單(含回覆內容)
  getReplies: async (req, res, next) => {
    try {
      const error = new Error()
      const loginUserId = authHelpers.getUser(req).id
      const targetUserId = req.params.id

      // 找不到使用者可以調閱他/她的回覆推文清單
      if (isNaN(targetUserId) || !(await User.findByPk(targetUserId))) {
        error.code = 404
        error.message = '對應使用者不存在'
        return next(error)
      }
      // 目前使用者調閱另一個使用者X的回覆推文清單
      // (含暱稱/名稱、帳號、頭像、封面、它所回覆的推文是否也被目前使用者喜歡和回覆)
      // (時間、推文內容等)
      // 按回覆紀錄排序，由新至舊
      const findOption = {
        where: {
          UserId: targetUserId
        },
        include: [
          {
            model: User,
            as: 'ReplyAuthor',
            attributes: [
              'id', 'account', 'name',
              'cover', 'avatar'
            ]
          },
          {
            model: Tweet,
            as: 'TargetTweet',
            include: [
              {
                model: User,
                as: 'TweetAuthor',
                attributes: ['id', 'name', 'account', 'avatar', 'cover']
              }
            ]
          }
        ],
        attributes: [
          'id', 'UserId', 'TweetId',
          'comment', 'createdAt', 'updatedAt',
          [
            sequelize.literal(`
                  EXISTS (
                      SELECT 1 FROM Likes
                      WHERE UserId = ${loginUserId} 
                      AND TweetId = TargetTweet.id
                    )
            `),
            'isLikedTweet'
          ],
          [
            sequelize.literal(`
                  EXISTS (
                      SELECT 1 FROM Replies
                      WHERE UserId = ${loginUserId} 
                      AND TweetId = TargetTweet.id
                    )
            `),
            'isRepliedTweet'
          ]
        ],
        order: [['createdAt', 'DESC']]
      }
      const replies = await Reply.findAll(findOption)

      const results = replies.map(r => {
        r = r.toJSON()
        r.isLikedTweet = Boolean(r.isLikedTweet)
        r.isRepliedTweet = Boolean(r.isRepliedTweet)
        return r
      })

      return res
        .status(200)
        .json(results)
    } catch (error) {
      // 系統出錯
      error.code = 500
      return next(error)
    }
  }
}

module.exports = userController
