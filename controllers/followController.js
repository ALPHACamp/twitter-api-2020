const { Followship, User, Like, Tweet } = require('../models')
const { getUser } = require('../_helpers')
const followController = {
  addFollowing: (req, res, next) => {
    const followerId = getUser(req).id
    const followingId = req.body.id
    if (!followingId) {
      return res
        .status(400)
        .json('缺少追蹤的用戶id')
    }
    if (followerId === followingId) {
      return res.status(400).json('無法追蹤自己')
    }
    Followship.findOne({
      where: {
        followerId,
        followingId
      }
    })
      .then((followship) => {
        if (followship) {
          return res.status(400).json('已經追蹤過')
        }
        return Followship.create({
          followerId,
          followingId
        })
      })
      .then(() => res.status(200).json('Add success'))
      .catch((error) => next(error))
  },
  removeFollowing: (req, res, next) => {
    const followerId = getUser(req).id
    const followingId = req.params.id
    if (!followingId) {
      return res.status(400).json('缺少追蹤的用戶id')
    }

    return Followship.findOne({
      where: {
        followerId,
        followingId
      }
    })
      .then((followship) => {
        if (!followship) { return res.status(401).json('未追蹤過') }
        return followship.destroy()
      })
      .then(() => res.status(200).json('unfollow success'))
      .catch((error) => next(error))
  },
  getFollowers: async (req, res, next) => {
    const followingId = req.params.id
    if (!followingId) {
      return res.status(400).json('缺少追蹤的用戶id')
    }
    const user = await User.findByPk(followingId)
    if (!user) return res.status(400).json('用戶不存在')
    // error "SequelizeEagerLoadingError: User is not associated to Followship!"
    try {
      const followers = await User.findAll({
        where: { id: followingId },
        attributes: [],
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: ['id', 'name', 'account', 'avatar', 'introduction']
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      followers.forEach((follower) => {
        follower.introduction?.substring(0, 50)
      })
      const data = followers[0]
      delete data.Followship
      return res.status(200).json(data)
    } catch (error) {
      return next(error)
    }
  },
  getFollowings: async (req, res, next) => {
    const followerId = req.params.id
    if (!followerId) {
      return res.status(400).json('缺少追蹤的用戶id')
    }
    const user = await User.findByPk(followerId)
    if (!user) return res.status(400).json('用戶不存在')
    // error "SequelizeEagerLoadingError: User is not associated to Followship!"
    try {
      const followings = await User.findAll({
        where: { id: followerId },
        attributes: [],
        include: [
          {
            model: User,
            as: 'Followings',
            attributes: ['id', 'name', 'account', 'avatar', 'introduction']
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      followings.forEach((following) => {
        following.introduction?.substring(0, 50)
      })
      const data = followings[0]
      delete data.Followship
      return res.status(200).json(data)
    } catch (error) {
      return next(error)
    }
  },
  getFollowCounts: (req, res, next) => {
    const userId = req.params.id
    if (!userId) return res.status(400).json('缺少用戶id')
    User.findByPk(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json('用戶不存在')
        }
        return Promise.all([
          Followship.count({ where: { followerId: userId } }),
          Followship.count({ where: { followingId: userId } })
        ])
      })
      .then(([followingCount, followerCount]) => {
        const data = {
          followingCount,
          followerCount
        }
        return res.status(200).json(data)
      })
      .catch((error) => next(error))
  },
  addLike: (req, res, next) => {
    const UserId = req.user.id
    const TweetId = req.params.id
    if (!TweetId) return res.status(400).json('缺少推文id')
    // 檢查是否有推文
    return Tweet.findByPk(TweetId)
      .then((tweet) => {
        if (!tweet) {
          return res.status(400).json('推文不存在')
        }
      })
      .then(() => {
        return Like.findOne({
          where: {
            UserId,
            TweetId
          },
          raw: true
        })
      })
      .then(like => {
        if (like) return res.status(400).json('已按過讚')
        return Like.create({
          UserId,
          TweetId
        })
      })
      .then(() => res.status(200).json('Like success'))
      .catch((error) => next(error))
  },
  removeLike: (req, res, next) => {
    const UserId = req.user.id
    const TweetId = req.params.id
    if (!TweetId) return res.status(400).json('缺少推文id')
    return Like.findOne({
      where: {
        UserId,
        TweetId
      }
    })
      .then((like) => {
        if (!like) return res.status(400).json('未按過讚')
        if (like.toJSON().UserId !== UserId) return res.status(400).json('非本人按讚')
        return like.destroy()
      })
      .then(() => res.status(200).json('Unlike success'))
      .catch((error) => next(error))
  },
  getLikes: (req, res, next) => {
    const UserId = req.params.id
    if (!UserId) {
      return res.status(400).json('缺少用戶id')
    }
    // 這個api除了給likecounts外也要給出like的關係，所以不能只回likecounts否則測試會失敗
    Like.findAll({
      where: { UserId },
      attributes: ['TweetId', 'UserId'],
      raw: true,
      nest: true
    })
      .then((user) => {
        if (!user) return res.status(400).json('找不到')
        const likeCounts = user.length
        user.push({ likeCounts })
        return res.status(200).json(user)
      })
      .catch((error) => next(error))
  }
}

module.exports = followController
