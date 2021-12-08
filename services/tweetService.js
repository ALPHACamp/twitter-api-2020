const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like
const helpers = require('../_helpers')

const tweetService = {
  postTweet: (req, res, callback) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    if (!req.body.description) {
      callback({ status: "error", message: "text didn't exist" });
    } else {
      return Tweet.create({
        description: req.body.description,
        UserId: currentUser.id,
      }).then((tweet) => {
        callback({
          status: "success",
          message: "tweet was successfully created",
        });
      });
    }
  },

  getTweets: (req, res, callback) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    Tweet.findAll({ 
      include: [User, { model: Reply }, { model: Like }],
      order: [['createdAt', 'DESC']]
     }).then(
      (tweets) => {
      let newTweets = tweets.map((d) => {
        let tweetLikeCount = d.dataValues.Likes.filter(
          (d) => d.isLike === true
        ).length;
        let tweetReplyCount = d.dataValues.Replies.map((d) => d.id).length;
        let userIsLike = d.dataValues.Likes.find(
          (d) => d.UserId === currentUser.id
        );
        if (!userIsLike) {
          userIsLike = false
        } else {
          userIsLike = userIsLike.isLike
        }
        d = {
          ...d.dataValues,
          tweetReplyCount,
          tweetLikeCount,
          isLike: userIsLike,
        };
        return d;
      });
      return callback({ tweets: newTweets });
    });
  },

  getTweet: (req, res, callback) => {
    const currentUser = req.user ? req.user : helpers.getUser(req)
    return Tweet.findByPk(req.params.id, {
      include: [User, { model: Like }, { model: Reply, include: [User] }],
    }).then((tweet) => {
      const tweetReplyCount = tweet.Replies.length;
      const tweetLikeCount = tweet.Likes.filter(
        (d) => d.isLike === true
      ).length;
      console.log('@@@@@@@',tweet.Likes.length)
      // let isLike =
      //   tweet.Likes.length !== 0 ? tweet.Likes.map((d) => d.isLike) : false;
      let tweetLike = tweet.Likes.filter((d, index) => d.isLike === true)
      tweetLike = tweetLike.map((d) => d.UserId).includes(currentUser.id)
        // console.log('isliek',isLike);
        // 測試 ISLIKE
        // let userIsLike = d.dataValues.Likes.find((d) => d.UserId);
        // // userIsLike = {
        // //   id: userIsLike.id ? userIsLike.id : false,
        // //   TweetId: userIsLike.TweetId ? userIsLike.TweetId : false,
        // //   UserId: userIsLike.UserId ? userIsLike.UserId : false,
        // //   isLike: userIsLike.isLike ? userIsLike.isLike : false
        // // }
        // // console.log(userIsLike)
        // if (!userIsLike) {
        //   userIsLike = false;
        //   userIsLike = {
        //     isLike: false
        //     // id: userIsLike.id ? userIsLike.id : false,
        //     // TweetId: userIsLike.TweetId ? userIsLike.TweetId : false,
        //     // UserId: userIsLike.UserId ? userIsLike.UserId : false,
        //     // isLike: userIsLike.isLike ? userIsLike.isLike : false,
        //   };
        // } else {
        //   userIsLike = userIsLike.isLike;
        // }
        // console.log(userIsLike);

      callback({
        tweet: tweet.toJSON(),
        tweetReplyCount: tweetReplyCount,
        tweetLikeCount: tweetLikeCount,
        isLike: tweetLike,
      });
    });
  },
};
module.exports = tweetService

 // getTweets: (req, res) => {
  //   const currentUser = req.user ? req.user : helpers.getUser(req);
  //   // Tweet.findAll({ include: [User, Reply, Like] }).then((tweets) => {
  //   Tweet.findAll({ include: [
  //     User,
  //     { model: Reply },
  //     { model: Like }
  //     ] }).then((tweets) => {
  //     let tweetReplyCount;
  //     console.log("tweet", tweets.length);

  //     let newTweets = tweets.map((d) => {
  //       let tweetLikeCount = d.dataValues.Likes.filter(d => d.isLike === true).length
  //       let tweetReplyCount = d.dataValues.Replies.map((d) => d.id).length
  //       let userIsLike = d.dataValues.Likes.find((d) => d.UserId)
  //       // userIsLike = {
  //       //   id: userIsLike.id ? userIsLike.id : false,
  //       //   TweetId: userIsLike.TweetId ? userIsLike.TweetId : false,
  //       //   UserId: userIsLike.UserId ? userIsLike.UserId : false,
  //       //   isLike: userIsLike.isLike ? userIsLike.isLike : false
  //       // }
  //       // console.log(userIsLike)
  //       if (!userIsLike) {
  //         userIsLike = false;
  //         userIsLike = {
  //           id: userIsLike.id ? userIsLike.id : false,
  //           TweetId: userIsLike.TweetId ? userIsLike.TweetId : false,
  //           UserId: userIsLike.UserId ? userIsLike.UserId : false,
  //           isLike: userIsLike.isLike ? userIsLike.isLike : false
  //         }
  //       } else {
  //         userIsLike = userIsLike.isLike;
  //       }
  //       console.log(userIsLike);
  //       d = {
  //         ...d.dataValues,
  //         tweetReplyCount,
  //         tweetLikeCount,
  //         isLike: userIsLike,
  //       };
  //       return d;
  //     });
  //     return res.render("tweets", {
  //       tweets: newTweets,
  //     });
  //   });
  // },