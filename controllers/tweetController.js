const db = require("../models");
const Tweet = db.Tweet;

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll().then((tweets) => {
      console.log(tweets);
      return res.render("tweets", { tweets: tweets });
    });
  },

  postTweet: (req, res) => {
    console.log('body',req.body)
    console.log('user',req.user)
    const userId = Math.floor(Math.random() * 6);
    console.log(userId);
    Tweet.create({
      description: req.body.description,
      // UserId: '1',
      UserId: Math.floor(Math.random() * 6),
    }).then((tweet) => {
      console.log(tweet);
      res.redirect("/tweets");
    });
  },
};

module.exports = tweetController;
