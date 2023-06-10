const { User, Tweet } = require("../models")
const { getUser } = require("../_helpers")
const Sequelize = require("sequelize")
const { literal } = Sequelize
const moment = require('moment')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: { exclude: ["password", "createdAt", "updatedAt", "role", "introduction"] }
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`TIMESTAMPDIFF(SECOND, Tweet.created_at, NOW())`),
            "diffCreatedAt",
          ],
          [
            Sequelize.literal(
              "(SELECT COUNT(DISTINCT id) FROM Replies WHERE Replies.tweet_id = tweet.id)"
            ),
            "replyCount",
          ],
          [
            Sequelize.literal(
              "(SELECT COUNT(DISTINCT id) FROM Likes WHERE Likes.tweet_id = tweet.id)"
            ),
            "likeCount",
          ]
        ],
        exclude: ["UserId"]
      },
      nest: true,
      raw: true,
    })
      .then((tweets) => {
        if (!tweets) throw new Error("No tweets found")
        const processedTweets = tweets.map((tweet) => {
          const createdAt = moment(tweet.createdAt).format('YYYY-MM-DD HH:mm:ss')
          const updatedAt = moment(tweet.updatedAt).format('YYYY-MM-DD HH:mm:ss')
          const diffCreatedAt = moment().subtract(tweet.diffCreatedAt, 'seconds').fromNow()
          return {
            ...tweet,
            createdAt,
            updatedAt,
            diffCreatedAt
          }
        })
        return res.status(200).json(processedTweets)
      })
      .catch((err) => next(err))
  },

  getTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.tweet_id, {
      include: [
        {
          model: User,
          attributes: { exclude: ["password", "createdAt", "updatedAt", "role", "introduction"] }
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`TIMESTAMPDIFF(SECOND, Tweet.created_at, NOW())`),
            "diffCreatedAt",
          ],
          [
            Sequelize.literal(
              "(SELECT COUNT(DISTINCT id) FROM Replies WHERE Replies.tweet_id = tweet.id)"
            ),
            "replyCount",
          ],
          [
            Sequelize.literal(
              "(SELECT COUNT(DISTINCT id) FROM Likes WHERE Likes.tweet_id = tweet.id)"
            ),
            "likeCount",
          ]
        ],
        exclude: ["UserId"]
    }})
      .then((tweet) => {
        // Error: tweet not found
        if (!tweet) throw new Error("No tweet found")
        const createdAt = moment(tweet.createdAt).format('YYYY-MM-DD HH:mm:ss')
        const updatedAt = moment(tweet.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        const diffCreatedAt = moment().subtract(tweet.diffCreatedAt, 'seconds').fromNow()
        const processedTweet = {
          ...tweet.toJSON(),
          createdAt,
          updatedAt,
          diffCreatedAt
        }
        return res.status(200).json(processedTweet)
      })
      .catch((err) => next(err))
},

  postTweets: (req, res, next) => {
    const { description } = req.body
    if (!description) {
      throw new Error("Tweet content is required!")
    }
    // get current user id
    const userId = getUser(req).id

    return Tweet.create({
      userId,
      description,
    })
      .then((newTweet) => {
        return res.status(200).json(newTweet)
      })
      .catch((err) => next(err))
  }
}
module.exports = tweetController
