const helpers = require('../_helpers')
const { User, Tweet, Reply, Like,sequelize } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
     try {
       const currentUserId = helpers.getUser(req).id;

       const [tweets, likes] = await Promise.all([
         Tweet.findAll({
           attributes: ["id", "description", "createdAt"],
           include: [
             {
               model: User,
               attributes: ["id", "name", "account", "avatar"],
             },
             { model: Reply },
             { model: Like },
           ],
           order: [["createdAt", "DESC"]],
         }),
         Like.findAll({ where: { UserId: currentUserId }, raw: true }),
       ]);

       const currentUserLikes = likes.map((l) => l.TweetId);
       const data = tweets.map((tweet) => {
         return {
           tweetId: tweet.id,
           description: tweet.description,
           tweetOwnerId: tweet.User.id,
           tweetOwnerName: tweet.User.name,
           tweetOwnerAccount: tweet.User.account,
           tweetOwnerAvatar: tweet.User.avatar,
           tweetTime: tweet.createdAt,
           replyCount: tweet.dataValues.Replies.length,
           likeCount: tweet.dataValues.Likes.length,
           isLiked: currentUserLikes.includes(tweet.dataValues.id),
         };
       });

       return res.status(200).json(data);
     } catch (err) {
       next(err);
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
     const currentUserId = helpers.getUser(req).id;
     const tweetId = req.params.tweet_id;

     const [tweet, likes] = await Promise.all([
       Tweet.findByPk(tweetId,{
         attributes: ["id", "description", "createdAt"],
         include: [
           {
             model: User,
             attributes: ["id", "name", "account", "avatar"],
           },
           { model: Reply },
           { model: Like },
         ],
         order: [["createdAt", "DESC"]],
         raw:true,
         nest:true
       }),
       Like.findAll({ where: { UserId: currentUserId }, raw: true }),
     ]);
     console.log(tweet);

     const currentUserLikes = likes.map((l) => l.TweetId);
     const data = {
         tweetId: tweet.id,
         description: tweet.description,
         tweetOwnerId: tweet.User.id,
         tweetOwnerName: tweet.User.name,
         tweetOwnerAccount: tweet.User.account,
         tweetOwnerAvatar: tweet.User.avatar,
         tweetTime: tweet.createdAt,
        //  isLiked: currentUserLikes.includes(tweet.id),
       };

      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const { tweet_id: tweetId } = req.params;
      // const tweet = await Tweet.findByPk(tweetId);
      // if (!tweet) {
      //   return res.status(404).json({ error: "Tweet not found!" });
      // }

      // const replies = await Reply.findAll({
      //   where: { TweetId: tweetId },
      //   order: [["createdAt", "DESC"]],
      //   raw: true,
      //   nest: true,
      // });

      // return res.status(200).json(replies);

      const tweet = await Tweet.findByPk(tweetId, {
        attributes: ["id", "description", "createdAt"],
        include: [
          {
            model: User,
            attributes: ["id", "name", "account", "avatar"],
          },
        ],
        raw: true,
        nest: true,
      });
      if (!tweet) {
        return res.status(404).json({ error: "Tweet not found!" });
      }
      let replies = await Reply.findAll({
        where: { TweetId: tweetId },
        order: [["createdAt", "DESC"]],
        attributes: [
          ["id", "replyId"],
          ["comment", "comment"],
          ["UserId", "replyUserId"],
          ["createdAt", "replyCreatedAt"],
        ],
        raw: true,
        nest: true,
      });
      replies = replies.map((reply) => ({
        ...reply,
      }));
      return res.status(200).json(replies);
      // return res.status(200).json({ tweet, replies });

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
