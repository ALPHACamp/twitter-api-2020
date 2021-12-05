const db = require("../models");
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like


const tweetController = {
  getTweets: (req, res) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    Tweet.findAll({ include: [
        User, 
        Reply,
        Like
      ] 
    }).then((tweets) => { 
      // console.log("]]]]]]]]]", currentUser.id);
      // console.log(tweets)
     let likeData = tweets.Replies
    //  console.log(likeData)
      return res.render("tweets", {
        tweets: tweets,
        Reply: Reply,
        userId: currentUser.id 
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
    const currentUser = req.user ? req.user : helpers.getUser(req);
    return Tweet.findByPk(req.params.id, {
      include: [ 
        User,
        { model: Like },
        { model: Reply, include: [User] }],
    }).then((tweet) => {
      const tweetReplyCount = tweet.Replies.length
      // const tweetLikeCount = tweet.Likes.map(d => d.isLike === true).length
      console.log('%%%%%%%%%%%',tweet.Likes.length)
      const tweetLikeCount = tweet.Likes.filter((d) => {
        console.log('##################',d.isLike);
        return d.isLike === true 
      }).length;
      // const tweetLikeCount = tweet.Likes.length
      console.log("tweetLikeCount", tweetLikeCount);
      const isLike = tweet.Likes.map((d) => d.UserId).includes(currentUser.id)
      // const isLike = tweet.Likes.map(d => {
      //   console.log('```````',d)
      //   return {
      //     id: d.id,
      //     isLike: d.isLike
      //   }
      // })
      // console.log(
      //   "tweet",
      //   tweetReplyCount,
      //   "tweetLikeCount",
      //   tweetLikeCount,
      //   isLike
      // );
      return res.render("tweet", {
        tweet: tweet.toJSON(),
        tweetReplyCount: tweetReplyCount,
        tweetLikeCount: tweetLikeCount
      });
    });
  },
};

module.exports = tweetController;
