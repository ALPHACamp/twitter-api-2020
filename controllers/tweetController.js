const db = require("../models");
const Tweet = db.Tweet;

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll().then((tweets) => {
      return res.render("tweets", { tweets: tweets });
    });
  },

  postTweet: (req, res) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    Tweet.create({
      description: req.body.description,
      UserId: currentUser.id,
    }).then((tweet) => {
      res.redirect("/tweets");
    });
  },
};

module.exports = tweetController;
