const db = require("../models");
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like


const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({ 
      include: [
        User, 
        Reply
      ] 
    }).then((tweets) => {
      return res.render("tweets", { tweets: tweets });
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

  getTweet: (req, res, callback) => {
    return Tweet.findByPk(req.params.id, {
      include: [User, { model: Reply, include: [User] }],
    }).then((tweet) => {
      console.log('@@@@@@@@@@','tweet',tweet)
      // console.log(tweet.User)
      // const isLiked = tweet.User.map((d) => d.id).includes(
      //   helpers.getUser(req).id
      // );
      // callback({
        // tweet: tweet,
        // isLiked: isLiked,
      // });
      return res.render('tweet', { tweet: tweet.toJSON()})
    });
  },
};

module.exports = tweetController;
