const db = require("../models");
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetService = require("../services/tweetService");

const tweetController = {
  getTweets: (req, res) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    Tweet.findAll({ include: [User, Reply, Like] }).then((tweets) => {
      // console.log("]]]]]]]]]", currentUser.id);
      // console.log(tweets)
      let likeData = tweets.Replies;
      //  console.log(likeData)
      return res.render("tweets", {
        tweets: tweets,
        Reply: Reply,
        userId: currentUser.id,
      });
    });
  },

  postTweet: (req, res) => {
    const currentUser = req.user ? req.user : helpers.getUser(req)
    Tweet.create({
      description: req.body.description,
      UserId: currentUser.id,
    }).then((tweet) => {
      res.redirect("/tweets");
    });
  },

  getTweet: (req, res) => {
    tweetService.getTweet(req, res, (data) => {
      return res.render('tweet', data)
    })
  },
};

module.exports = tweetController;
