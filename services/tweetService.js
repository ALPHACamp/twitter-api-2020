const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like
const helpers = require('../_helpers')

const tweetService = {
  postTweet: (req, res, callback) => {
    if (!req.body.description) {
      callback({ status: "error", message: "text didn't exist" });
    } else {
      return Tweet.create({
        description: req.body.description,
        UserId: helpers.getUser(req).id,
      }).then((category) => {
        callback({
          status: "success",
          message: "tweet was successfully created",
        });
      });
    }
  },
  getTweets: (req, res, callback) => {
    return Tweet.findAll({ include: User }).then((result) => {
      callback({ tweets: result });
    });
  },
  getTweet: (req, res, callback) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    return Tweet.findByPk(req.params.id, {
      include: [User, { model: Like }, { model: Reply, include: [User] }]
    }).then((tweet) => {
      const tweetReplyCount = tweet.Replies.length;
      const tweetLikeCount = tweet.Likes.filter((d) => d.isLike === true
      ).length;
      let isLike = tweet.Likes.find((d) => d.UserId === currentUser.id);
      isLike = isLike.isLike;
      callback({ tweet: tweet.toJSON(),
        tweetReplyCount: tweetReplyCount,
        tweetLikeCount: tweetLikeCount,
        isLike: isLike,})
    });
  },
};

module.exports = tweetService