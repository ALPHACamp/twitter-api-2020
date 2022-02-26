
const { User, Followship, Tweet, Like } = require('../models')
const { sequelize } = require('../models')
const authHelpers = require('../_helpers')

const tempController = {
  // 獲取指定使用者所追隨的使用者清單
  getFollowings: async (req, res, next) => {
    try {
      const error = new Error()
      const loginUserId = authHelpers.getUser(req).id
      const targetUserId = req.params.id

      // 找不到使用者可以調閱他/她追隨的使用者清單
      if (!(await User.findByPk(targetUserId))) {
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
      if (!(await User.findByPk(targetUserId))) {
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
      if (!(await User.findByPk(targetUserId))) {
        error.code = 404
        error.message = '對應使用者不存在'
        return next(error)
      }

      // 目前使用者調閱另一個使用者X的喜歡推文清單
      // (含暱稱/名稱、帳號、頭像、封面、它所喜歡的推文是否也被目前使用者喜歡和回覆)
      // (時間、推文內容、)
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
                attributes: { exclude: ['password'] }
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
  }
}

exports = module.exports = tempController
