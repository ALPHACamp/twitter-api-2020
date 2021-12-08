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
    Tweet.findAll({ include: [User, { model: Reply }, { model: Like }] }).then(
      (tweets) => {
      console.log('tweets.',tweets.length)
      console.log("tweets", tweets[0].Likes[0]);
      let newTweets = tweets.map((d) => {
        let tweetLikeCount = d.dataValues.Likes.filter(
          (d) => d.isLike === true
        ).length;
        let tweetReplyCount = d.dataValues.Replies.map((d) => d.id).length;
        let userIsLike = d.dataValues.Likes.map((d) => d.UserId).includes(currentUser.id)
        let paramsLike
        console.log(userIsLike)
        if (!userIsLike) {
          userIsLike = false;
        } else  {
          // userIsLike = {
          //   id: userIsLike.Likes.id ? userIsLike.Likes.id : false,
          //   UserId: userIsLike.Likes.UserId ? userIsLike.UserId.id : false,
          //   tweetId: userIsLike.Likes.TweetId ? userIsLike.TweetId.id : false,
          // };
          userIsLike = userIsLike
        }
        
        console.log("req.params.userId", req.params.id,'當下使用者',currentUser.id,'userIsLike',userIsLike)
        // console.log('params',paramsLike);
        d = {
          ...d.dataValues,
          tweetReplyCount,
          tweetLikeCount,
          isLike: userIsLike,
        }
        return d;
      });
      let count = newTweets.filter(d => d.isLike === true)
      console.log(count.length)
      return callback({ tweets: newTweets });
    });
  },

  getTweet: (req, res, callback) => {
    return Tweet.findByPk(req.params.id, {
      include: [User, { model: Like }, { model: Reply, include: [User] }],
    }).then((tweet) => {
      const tweetReplyCount = tweet.Replies.length;
      const tweetLikeCount = tweet.Likes.filter(
        (d) => d.isLike === true
      ).length;

      let isLike =
        tweet.Likes.length !== 0 ? tweet.Likes.map((d) => d.isLike) : false;
      
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
          // userIsLike = false;
          // userIsLike = {
            // isLike: false
            // id: userIsLike.id ? userIsLike.id : false,
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
        isLike: isLike,
      });
    });
  },
};
module.exports = tweetService