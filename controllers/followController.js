const { Followship, User, Like, Tweet } = require('../models')
const { getUser } = require('../_helpers')
const followController = {
  addFollowing: (req, res, next) => {
    const followerId = req.user.id || getUser(req).dataValues.id
    const followingId = req.body.id
    if (!followingId) {
      return res.status(400).json('Following id is necessary')
    }
    if (Number(followerId) === Number(followingId)) {
      return res.status(400).json('Can not follow yourself')
    }
    Followship.findOne({
      where: {
        followerId,
        followingId
      }
    })
      .then((followship) => {
        if (followship) {
          return res.status(400).json('Already followed')
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
    const followerId = req.user.id || getUser(req).dataValues.id
    const followingId = req.params.id
    if (!followingId) {
      return res.status(400).json('Following id is necessary')
    }

    return Followship.destroy({
      where: {
        followerId,
        followingId
      }
    })
      .then((count) => {
        if (count === 0) {
          return res.status(401).json('Not followed yet')
        }
        return res.status(200).json('unfollow success')
      })
      .catch((error) => next(error))
  },
  getFollowers: (req, res, next) => {
    const followingId = req.params.id
    if (!followingId) {
      return res.status(400).json('User id is necessary')
    }
    User.findByPk(followingId)
      .then((user) => {
        if (!user) return res.status(400).json('User do not exists')
        return Promise.all([
          user.getFollowers({
            attributes: [
              'id',
              'name',
              'account',
              'avatar',
              'introduction',
              'updatedAt'
            ],
            raw: true,
            nest: true
          }),
          User.findAll({
            where: { id: followingId },
            attributes: [],
            include: [
              {
                model: User,
                as: 'Followings',
                attributes: ['id'],
                through: { attributes: [] }
              }
            ],
            raw: true,
            nest: true
          })
        ])
      })
      .then(([followers, followings]) => {
        const followingsId = followings.map(following => {
          return following.Followings.id
        })
        return [followers, followingsId]
      })
      .then(([followers, followingsId]) => {
        return followers.map(follower => {
          const introduction = follower.introduction?.substring(0, 50)
          const isFollowing = followingsId.includes(follower.id)
          return {
            followerId: follower?.id,
            name: follower?.name,
            account: follower?.account,
            avatar: follower?.avatar,
            introduction,
            updatedAt: follower?.Followship?.updatedAt,
            isFollowing
          }
        })
          .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt))
      })
      .then((data) => res.status(200).json(data))
      .catch((error) => next(error))
  },
  getFollowings: (req, res, next) => {
    const followerId = req.params.id
    if (!followerId) {
      return res.status(400).json('Follower id is necessary')
    }
    User.findByPk(followerId)
      .then((user) => {
        if (!user) return res.status(400).json('User not exists')
        return user.getFollowings({
          attributes: [
            'id',
            'name',
            'account',
            'avatar',
            'introduction',
            'updatedAt'
          ],
          raw: true,
          nest: true
        })
      })
      .then((followings) => {
        const data = followings
          .map((following) => {
            const introduction = following.introduction?.substring(0, 50)
            return {
              followingId: following?.id,
              name: following?.name,
              account: following?.account,
              avatar: following?.avatar,
              introduction,
              updatedAt: following?.Followship?.updatedAt
            }
          })
          .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt))
        return data
      })
      .then((data) => res.status(200).json(data))
      .catch((error) => next(error))
  },
  getFollowCounts: (req, res, next) => {
    const userId = req.params.id
    if (!userId) return res.status(400).json('User id is necessary')
    User.findByPk(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json('User do not exists')
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
    const UserId = req.user.id || getUser(req).dataValues.id
    const TweetId = req.params.id
    if (!TweetId) return res.status(400).json('Tweet id is necessary')
    // 檢查是否有推文
    return Tweet.count({ where: { id: TweetId } })
      .then((count) => {
        if (count === 0) {
          return res.status(400).json('Tweet id not exists')
        }
        return Like.findOne({
          where: {
            UserId,
            TweetId
          },
          raw: true
        })
      })
      .then((like) => {
        if (like) return res.status(400).json('Already liked')
        return Like.create({
          UserId,
          TweetId
        })
      })
      .then(() => res.status(200).json('Like success'))
      .catch((error) => next(error))
  },
  removeLike: (req, res, next) => {
    const UserId = req.user.id || getUser(req).dataValues.id
    const TweetId = req.params.id
    if (!TweetId) return res.status(400).json('缺少推文id')
    return Like.findOne({
      where: {
        UserId,
        TweetId
      }
    })
      .then((like) => {
        if (!like) return res.status(400).json('Not liked yet')
        if (like.toJSON().UserId !== UserId) { return res.status(400).json('Your not like by yourself') }
        return like.destroy()
      })
      .then(() => res.status(200).json('Unlike success'))
      .catch((error) => next(error))
  },
  getLikes: (req, res, next) => {
    const UserId = req.params.id
    if (!UserId) {
      return res.status(400).json('User id is necessary')
    }
    // 這個api除了給likecounts外也要給出like的關係，所以不能只回likecounts否則測試會失敗
    Like.findAll({
      where: { UserId },
      attributes: ['TweetId', 'UserId'],
      raw: true,
      nest: true
    })
      .then((user) => {
        if (!user) return res.status(400).json('User not found')
        const likeCounts = user.length
        user.push({ likeCounts })
        return res.status(200).json(user)
      })
      .catch((error) => next(error))
  }
}

module.exports = followController
