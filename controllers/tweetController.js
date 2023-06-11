const helpers = require('../_helpers')
const { User, Tweet, Reply, Like,sequelize } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const tweets = await Tweet.findAll({
        // define output attributes
        attributes: [
          "id",
          "description",
          "createdAt",
          // use Sequelize's count
          [
            sequelize.fn("COUNT", sequelize.col("Replies.TweetId")),
            "replyCount",
          ],
          [sequelize.fn("COUNT", sequelize.col("Likes.TweetId")), "likeCount"],

          // check the liked status
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM Likes
              WHERE
              Likes.TweetId = Tweet.id AND
              Likes.UserId = ${user.id}
      )`),
            "isLiked",
          ],
        ],
        // include related models
        include: [
          {
            model: User,
            attributes: ["id", "name", "account", "avatar"],
          },
          {
            model: Reply,
            attributes: [],
          },
          {
            model: Like,
            attributes: [],
            // attributes: ["UserId"],
          },
        ],
        // Group by tweetID and userID
        group: ["Tweet.id", "User.id"],
        // sort time
        order: [["createdAt", "DESC"]],
        raw: true,
      });
      const data = tweets.map((tweet) => {
        return {
          tweetId: tweet.id,
          description: tweet.description,
          tweetOwnerId: tweet["User.id"],
          tweetOwnerName: tweet["User.name"],
          tweetOwnerAccount: tweet["User.account"],
          tweetOwnerAvatar: tweet["User.avatar"],
          tweetTime: tweet.createdAt,
          replyCount: tweet.replyCount || 0,
          likeCount: tweet.likeCount || 0,
          isLiked: Boolean(tweet.isLiked),
        };
      });

      return res.status(200).json(data);
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const { description } = req.body

      // check if description is more than 160 characters
      if (description.trim().length > 140) {
        return res
          .status(400)
          .json({ error: 'Description should be within 160 characters!' })
      }
      // check if description is whitespace
      if (!description.trim().length) {
        return res
          .status(400)
          .json({ error: 'Description cannot be only whitespace!' })
      }

      // create a new tweet
      const UserId = user.id
      const newTweet = await Tweet.create({
        description,
        UserId
      })

      return res.status(200).json(newTweet)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweet_id, {
        attributes: ["id", "description", "createdAt"],
        include: [
          {
            model: User,
            attributes: ["id", "name", "account", "avatar"],
          },
          {
            model: Reply,
            attributes: ["id", "comment", "createdAt"],
            include: [
              {
                model: User,
                attributes: ["id", "account", "name", "avatar"],
              },
            ],
          },
          {
            model: Like,
          },
        ],
      });
      if (!tweet) {
        return res.status(404).json({ error: 'Tweet not found!' })
      }
      tweet.get({ plain: true });

      const data = {
        tweetId: tweet.id,
        description: tweet.description,
        tweetTime: tweet.createdAt,
        tweetOwner: tweet.User,
        // Replies: tweet.Replies.map((reply) => {
        //   return {
        //     replyId: reply.id,
        //     replyComment: reply.comment,
        //     replyTime: reply.createdAt,
        //     replyO: reply.User,
        //   };
        // }),
        replyCount: tweet.Replies ? tweet.Replies.length : 0,
        likeCount: tweet.Likes ? tweet.Likes.length : 0,
        isLiked: Boolean(tweet.isLiked),
      };

      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const { tweet_id: tweetId } = req.params
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        return res.status(404).json({ error: 'Tweet not found!' })
      }

      const replies = await Reply.findAll({
        where: { TweetId: tweetId },
        order: [['createdAt', 'DESC']],
        attributes: [['id','replyID'], ['comment'], ['UserId', 'replyUserId'], ['createdAt', 'replyCreatedAt']],
        raw: true,
        // nest: true
      })

      return res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },
  postReply: async (req, res, next) => {
    try {
      const { tweet_id: tweetId } = req.params
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        return res.status(404).json({ error: 'Tweet not found!' })
      }

      // check if comment is whitespace
      const { comment } = req.body
      if (comment.trim().length === 0) {
        return res
          .status(400)
          .json({ error: "Comment cannot be only whitespace!" });
      }

      // get user id
      const user = helpers.getUser(req)
      const UserId = user.id

      // create new reply
      const newReply = await Reply.create({
        comment,
        UserId,
        TweetId: tweetId
      })

      return res.status(200).json({
        status: "success",
      });
    } catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    try {
      console.log(req.body)
      const { tweet_id: tweetId } = req.params
      const tweet = await Tweet.findByPk(tweetId)

      if (!tweet) {
        return res.status(404).json({ error: 'Tweet not found!' })
      }
      // get user id
      const user = helpers.getUser(req)
      const UserId = user.id

      const like = await Like.findOne({
        where: {
          UserId: UserId,
          TweetId: tweetId
        }
      })

      if (like) {
        return res.status(200).json({ error: 'You have liked this tweet!' })
      }

      await Like.create({
        UserId: UserId,
        TweetId: tweetId,
        isLiked: true
      })
      return res.status(200).json({
        status: 'success'
      })
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const { tweet_id: tweetId } = req.params
      const tweet = await Tweet.findByPk(tweetId)

      if (!tweet) {
        return res.status(404).json({ error: 'Tweet not found!' })
      }
      // get user id
      const user = helpers.getUser(req)
      const UserId = user.id

      const like = await Like.findOne({
        where: {
          UserId: UserId,
          TweetId: tweetId
        }
      })

      // if the user hasn't liked the tweet
      if (!like) {
        return res.status(404).json({ error: "You haven't liked this tweet!" })
      }

      await like.destroy()

      return res.status(200).json({ message: 'Like removed successfully' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
