const { Tweet, User, Reply, Like } = require('../../models')
// const { Sequelize } = require('sequelize')
// const sequelize = new Sequelize('sqlite::memory:')
const helpers = require('../../_helpers')

const tweetController = {
  postTweet: async (req, res, next) => {
    const { description } = req.body
    const UserId = helpers.getUser(req)?.id

    try {
      if (!description || !UserId) {
        throw new Error('Data is missing a description or UserId!!')
      }
      const data = await Tweet.create({
        description,
        UserId
      })

      return res.json({
        status: 'success',
        data
      })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req)?.id
      if (!UserId) throw new Error('沒有 UserId')

      const limit = Number(req.query.limit) || null
      const tweets = await Tweet.findAll({
        attributes: ['id', 'description', 'createdAt', 'updatedAt'],
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatarImg', 'role']
          },
          {
            model: Reply,
            attributes: ['id']
          },
          {
            model: Like,
            attributes: ['likeUnlike', 'UserId']
          }
        ],
        order: [['created_at', 'DESC']],
        nest: true,
        limit
      })

      const data = tweets.map(t => {
        const replyTotal = t.Replies.length
        const likeTotal = t.Likes.filter(item => item.likeUnlike).length
        const isLike = t.toJSON().Likes.find(item => item.UserId === UserId)?.likeUnlike
        return {
          ...t.toJSON(),
          Replies: {
            replyTotal
          },
          Likes: {
            isLike: isLike || false,
            likeTotal
          }
        }
      })
      return res.status(200).json(
        data
      )
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req)?.id
      if (!UserId) throw new Error('沒有 UserId')

      const tweet = await Tweet.findByPk(req.params.tId, {
        attributes: ['id', 'description', 'createdAt', 'updatedAt'],
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatarImg']
          },
          {
            model: Reply,
            attributes: ['id', 'comment'],
            include: {
              model: User,
              attributes: ['id', 'account', 'name', 'avatarImg', 'createdAt', 'updatedAt']
            }
          },
          {
            model: Like,
            attributes: ['id', 'likeUnlike', 'UserId'],
            include: {
              model: User,
              attributes: ['id', 'account', 'name', 'avatarImg', 'createdAt', 'updatedAt']
            }
          }
        ],
        nest: true
      })
      if (!tweet) throw new Error('The tweet could not be found')
      const data = {
        ...tweet.toJSON(),
        replyTotal: tweet.Replies.length,
        likeTotal: tweet.Likes.filter(l => l.likeUnlike).length,
        isLike: tweet.Likes.find(item => item.UserId === UserId)?.likeUnlike || false
      }
      return res.status(200).json(
        data
      )
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
