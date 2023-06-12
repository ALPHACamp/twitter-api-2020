const { Followship, User, Like, Tweet, Sequelize } = require('../models')
const { getUser } = require('../_helpers')
const followController = {
  addFollowing: (req, res, next) => {
    const followerId = getUser.id
    const followingId = req.body.id
    if (!followingId) {
      return res
        .status(400)
        .json({ status: 'error', message: '缺少追蹤的用戶id' })
    }
    if (followerId === followingId) {
      return res.json('無法追蹤自己')
    }
    Followship.findOne({
      where: {
        followerId,
        followingId
      }
    })
      .then((followship) => {
        if (followship) { return res.json({ status: 'error', message: '已經追蹤過' }) }
        return Followship.create({
          followerId,
          followingId
        })
      })
      .then(() => res.json({ status: 'success', message: '成功追蹤' }))
      .catch((error) => next(error))
  },
  removeFollowing: (req, res, next) => {
    const followerId = getUser.id
    const followingId = req.params.id
    if (!followingId) {
      return res
        .status(400)
        .json({ status: 'error', message: '缺少追蹤的用戶id' })
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
      .then(() => res.json({ status: 'success', message: '成功取消追蹤' }))
      .catch((error) => next(error))
  },
  getFollowers: async (req, res, next) => {
    const followingId = req.params.id
    if (!followingId) {
      return res
        .status(400)
        .json({ status: 'error', message: '缺少追蹤的用戶id' })
    }

    const user = await User.findByPk(followingId)
    if (!user) { return res.status(404).json({ status: 'error', message: '用戶不存在' }) }

    try {
      const followships = await Followship.findAll({
        where: { followingId },
        include: [
          {
            model: User,
            as: 'follower',
            attributes: ['id', 'name', 'account', 'avatar', 'introduction']
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      const followers = followships.map((followship) => {
        const follower = followship.follower
        follower.introduction = follower.introduction.substring(0, 50)
        return follower
      })
      return res.json({ status: 'success', data: followers })
    } catch (error) {
      return next(error)
    }
  },
  getFollowings: (req, res, next) => {
    const followerId = req.params.id
    if (!followerId) {
      return res
        .status(400)
        .json({ status: 'error', message: '缺少追蹤的用戶id' })
    }

    User.findByPk(followerId)
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ status: 'error', message: '用戶不存在' })
        }
        return Followship.findAll({
          where: { followerId },
          include: [
            {
              model: User,
              as: 'following',
              attributes: ['id', 'name', 'account', 'avatar', 'introduction']
            }
          ],
          order: [['createdAt', 'DESC']]
        })
      })
      .then((followships) => {
        const followings = followships.map((followship) => {
          const following = followship.following
          following.introduction = following.introduction
            ? following.introduction.substring(0, 50)
            : ''
          return following
        })
        return res.json({ status: 'success', data: followings })
      })
      .catch((error) => next(error))
  },
  getFollowCounts: (req, res, next) => {
    const userId = req.params.id
    if (!userId) { return res.status(400).json({ status: 'error', message: '缺少用戶id' }) }

    User.findByPk(userId)
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ status: 'error', message: '用戶不存在' })
        }
        return Promise.all([
          Followship.count({ where: { followerId: userId } }),
          Followship.count({ where: { followingId: userId } })
        ])
      })
      .then(([followingCount, followerCount]) => {
        return res.json({
          status: 'success',
          data: { followingCount, followerCount }
        })
      })
      .catch((error) => next(error))
  },
  addLike: (req, res, next) => {
    const UserId = req.user.id
    const TweetId = req.params.id
    if (!TweetId) { return res.status(400).json({ status: 'error', message: '缺少推文id' }) }
    // 檢查是否有推文
    return Tweet.findByPk(TweetId)
      .then((tweet) => {
        if (!tweet) {
          return res.json({ status: 'error', message: '推文不存在' })
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
        if (like) return res.json({ status: 'error', message: '已按過讚' })
        return Like.create({
          UserId,
          TweetId
        })
      })
      .then(() => res.json({ status: 'success', message: '成功按讚' }))
      .catch((error) => next(error))
  },
  removeLike: (req, res, next) => {
    const UserId = req.user.id
    const TweetId = req.params.id
    if (!TweetId) { return res.status(400).json({ status: 'error', message: '缺少推文id' }) }

    return Like.findOne({
      where: {
        UserId,
        TweetId
      }
    })
      .then((like) => {
        if (!like) return res.json({ status: 'error', message: '未按過讚' })
        if (like.toJSON().UserId !== UserId) return res.json({ status: 'error', message: '非本人按讚' })
        return like.destroy()
      })
      .then(() => res.json({ status: 'success', message: '成功取消讚' }))
      .catch((error) => next(error))
  },
  getLikes: (req, res, next) => {
    const UserId = req.params.id
    if (!UserId) { return res.status(400).json({ status: 'error', message: '缺少用戶id' }) }
    let likeCounts = 0

    return User.findByPk(UserId, {
      include: [
        {
          model: Tweet,
          include: { model: Like, attributes: [] },
          attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('Tweets.Likes.id')), 'likeCount']
          ]
        }
      ],
      group: ['Tweets.id']
    })
      .then((user) => {
        if (!user) return res.status(400).json({ status: 'error', message: '找不到' })
        user.Tweets.forEach(tweet => (
          likeCounts += tweet.dataValues.likeCount
        ))
      })
      .then(() => res.json({ status: 'success', data: { likeCounts } }))
      .catch((error) => next(error))
  }
}

module.exports = followController
