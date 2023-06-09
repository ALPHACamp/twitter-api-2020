const { User, Tweet } = require("../models")
const { getUser } = require("../_helpers")
const Sequelize = require("sequelize")
const { literal } = Sequelize

const tweetController = {
getTweets: (req, res, next) => {
    Tweet.findAll({
      include: [
        { model: User, attributes: ["id", "name", "account", "avatar"] },
      ],
      nest: true,
      raw: true,
    })
      .then((tweets) => {
        if (!tweets) {
          return res
            .status(404)
            .json({ status: "error", message: "No tweets found" });
        }
        return res.status(200).json(tweets);
      })
      .catch((err) => next(err));
  },

  getTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.tweet_id, {
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*) 
              FROM replies AS reply
              WHERE 
                  reply.tweet_id = tweet.id
              )`),
            "replyCount",
          ],
          [
            literal(`(
              SELECT COUNT(*) 
              FROM likes AS liked
              WHERE 
                  liked.tweet_id = tweet.id
              )`),
            "likeCount",
          ],
        ],
      },
      include: [
        { model: User, attributes: ["id", "name", "account", "avatar"] },
      ],
    })
      .then((tweet) => {
        if (!tweet) {
          // Error: tweet not found
          return res
            .status(404)
            .json({ status: "error", message: "No tweet found" })
        }
        return res.status(200).json(tweet)
      })
      .catch((err) => next(err))
  },

  postTweets: (req, res, next) => {
    const { description } = req.body;
    if (!description) {
      throw new Error("Tweet content is required!")
    }
    // get current user id
    const user = getUser(req)
    const userId = user.id

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
