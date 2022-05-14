const { Tweet, User, Reply, Like } = require('../../models')
// const { Sequelize } = require('sequelize')
// const sequelize = new Sequelize('sqlite::memory:')
const helpers = require('../../_helpers')

const tweetController = {
  postTweet: async (req, res, next) => {
    const { description } = req.body
    const UserId = helpers.getUser(req)?.id

    try {
      if (!description || !UserId) throw new Error('Data is missing a description or UserId!!')
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
  getTweet: async (req, res, next) => {
    try {
      const limit = Number(req.query.limit) || null
      const tweets = await Tweet.findAll({
        attributes: ['id', 'description', 'createdAt', 'updatedAt'],
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatarImg']
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
        nest: true,
        limit
      })

      const data = tweets.map(t => {
        const replyTotal = t.Replies.length
        const likeTotal = t.Likes.filter(item => item.likeUnlike).length
        return {
          ...t.toJSON(),
          Replies: replyTotal,
          Likes: likeTotal
        }
      })
      return res.json(
        data
      )
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
