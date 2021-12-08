const db = require("../models");
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetService = require("../services/tweetService");

const tweetController = {
  getTweets: (req, res) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    // Tweet.findAll({ include: [User, Reply, Like] }).then((tweets) => {
    Tweet.findAll({ include: [
      User,
      { model: Reply },
      { model: Like }
      ] }).then((tweets) => {
      let tweetReplyCount;
      console.log("tweet", tweets.length);
      
      let newTweets = tweets.map((d) => {
        let tweetLikeCount = d.dataValues.Likes.filter(d => d.isLike === true).length
        let tweetReplyCount = d.dataValues.Replies.map((d) => d.id).length
        let userIsLike = d.dataValues.Likes.find((d) => d.UserId)
        // userIsLike = {
        //   id: userIsLike.id ? userIsLike.id : false,
        //   TweetId: userIsLike.TweetId ? userIsLike.TweetId : false,
        //   UserId: userIsLike.UserId ? userIsLike.UserId : false,
        //   isLike: userIsLike.isLike ? userIsLike.isLike : false
        // }
        // console.log(userIsLike)
        if (!userIsLike) {
          userIsLike = false;
          userIsLike = {
            id: userIsLike.id ? userIsLike.id : false,
            TweetId: userIsLike.TweetId ? userIsLike.TweetId : false,
            UserId: userIsLike.UserId ? userIsLike.UserId : false,
            isLike: userIsLike.isLike ? userIsLike.isLike : false
          }
        } else {
          userIsLike = userIsLike.isLike;
        }
        console.log(userIsLike);
        d = {
          ...d.dataValues,
          tweetReplyCount,
          tweetLikeCount,
          isLike: userIsLike,
        };
        return d;
      });
      return res.render("tweets", {
        tweets: newTweets,
      });
    });
  },

  postTweet: (req, res) => {
    tweetService.postTweet(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('/tweets')
      } else {
        req.flash('success_messages', data['message'])
        return res.redirect('/tweets')
      }
    })
  },

  getTweet: (req, res) => {
    tweetService.getTweet(req, res, (data) => {
      return res.render('tweet', data)
    })
  },
};

module.exports = tweetController;