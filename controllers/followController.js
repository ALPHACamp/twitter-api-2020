const { Followship, User, Like, Tweet, Sequelize } = require('../models')
const { getUser } = require('../_helpers')
const followController = {
  addFollowing: (req, res, next) => {
    const followerId = getUser.id
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
    const followerId = getUser.id
    const followingId = req.params.id
    if (!followingId) {
      return res
        .status(400)
        .json('缺少追蹤的用戶id')
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
      return res
        .status(400)
        .json('缺少追蹤的用戶id')
    }

    const user = await User.findByPk(followingId)
    if (!user) return res.status(400).json('用戶不存在')

    try {
      const followships = await Followship.findAll({
        where: { followingId },
        include: [
          {
            model: User,
            as: 'Follower',
            attributes: ['id', 'name', 'account', 'avatar', 'introduction']
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      const followers = followships.map((followship) => {
        const follower = followship.Follower
        console.log(follower)
        follower.introduction = follower.introduction ? follower.introduction.substring(0, 50) : ''
        return follower
      })
      return res.status(200).json(followers)
    } catch (error) {
      return next(error)
    }
  },
  getFollowings: (req, res, next) => {
    const followerId = req.params.id
    if (!followerId) {
      return res
        .status(400)
        .json('缺少追蹤的用戶id')
    }

    User.findByPk(followerId)
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json('用戶不存在')
        }
        return Followship.findAll({
          where: { followerId },
          include: [
            {
              model: User,
              as: 'Following',
              attributes: ['id', 'name', 'account', 'avatar', 'introduction']
            }
          ],
          order: [['createdAt', 'DESC']]
        })
      })
      .then((followships) => {
        const followings = followships.map((followship) => {
          const following = followship.Following
          following.introduction = following.introduction ? following.introduction.substring(0, 50) : ''
          return following
        })
        return res.status(200).json(followings)
      })
      .catch((error) => next(error))
  },
  getFollowCounts: (req, res, next) => {
    const userId = req.params.id
    if (!userId) return res.status(400).json('缺少用戶id')

    User.findByPk(userId)
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json('用戶不存在')
        }
        return Promise.all([
          Followship.count({ where: { followerId: userId } }),
          Followship.count({ where: { followingId: userId } })
        ])
      })
      .then(([followingCount, followerCount]) => {
        return res
          .status(200)
          .json(
            [followingCount, followerCount]
          )
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
    if (!UserId) return res.status(400).json('缺少用戶id')
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
        if (!user) return res.status(400).json('找不到')
        user.Tweets.forEach(tweet => (
          likeCounts += tweet.dataValues.likeCount
        ))
      })
      .then(() => res.status(200).json(likeCounts))
      .catch((error) => next(error))
  }
}

module.exports = followController
