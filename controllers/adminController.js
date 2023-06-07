const { User, Tweet, Reply } = require('../models')

const adminController = {
  getUsers: (req, res, next) => {
    User.findAll({
      raw: true,
      nest: true,
      attributes: ['account', 'name', 'avatar', 'coverPhoto'],
    })
      .then(users => {
        res.json({ status: 'success', users })
      })
      .catch(error => next(error))
  },
  deleteUser: (req, res, next) => {
    const userId = req.params.id
    User.findByPk(userId).then((user) => {
      user.destroy().then(() => {
        res.json({
          status: "success",
          message: `admin success delete user ${userId}`,
        });
      })
        .catch(error => next(error))
    })
      .catch(error => next(error))
  },
  getTweets: (req, res, next) => {
    Tweet.findAll({
      raw: true,
      nest: true,
      include: [
        { model: User, attributes: ['account', 'name', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        tweets.forEach(tweet => {
          tweet.description = tweet.description.substring(0, 50); // 只顯示前50個字
          tweet.description = tweet.description + "...";

          // 取得現在的時間
          const now = new Date();

          // 計算 createdAt 和 updatedAt 和現在的時間差
          const createdDiff = now - new Date(tweet.createdAt);
          const updatedDiff = now - new Date(tweet.updatedAt);

          // 選擇最近的時間差
          const lastUpdatedDiff = createdDiff < updatedDiff ? createdDiff : updatedDiff;

          // 轉換成所需的格式
          let lastUpdated;
          const diffInHours = lastUpdatedDiff / 1000 / 60 / 60;
          if (diffInHours < 1) {
            lastUpdated = `${Math.round(diffInHours * 60)} minutes ago`;
          } else if (diffInHours < 24) {
            lastUpdated = `${Math.round(diffInHours)} hours ago`;
          } else {
            lastUpdated = `${Math.round(diffInHours / 24)} days ago`;
          }

          // 新增 lastUpdated 欄位到 tweet 物件中
          tweet.lastUpdated = lastUpdated;
        })
        return res.json({ status: 'success', tweets })
      })
      .catch(error => next(error))
  },
  deleteTweet: (req, res, next) => {
    const tweetId = req.params.id
    Tweet.findByPk(tweetId).then((tweet) => {
      tweet.destroy().then(() => {
        res.json({
          status: "success",
          message: `admin success delete tweet ${tweetId}`,
        });
      })
        .catch(error => next(error))
    })
      .catch(error => next(error))
  },
  getReplies: (req, res) => {
    Reply.findAll({
      raw: true,
      nest: true,
      include: [{ model: User, attributes: ['account', 'name', 'avatar'] }],
    })
      .then((replies) => {
        replies.forEach((reply) => {
          // 取得現在的時間
          const now = new Date();

          // 計算 createdAt 和 updatedAt 和現在的時間差
          const createdDiff = now - new Date(reply.createdAt);
          const updatedDiff = now - new Date(reply.updatedAt);

          // 選擇最近的時間差
          const lastUpdatedDiff = createdDiff < updatedDiff ? createdDiff : updatedDiff;

          // 轉換成所需的格式
          let lastUpdated;
          const diffInHours = lastUpdatedDiff / 1000 / 60 / 60;
          if (diffInHours < 1) {
            lastUpdated = `${Math.round(diffInHours * 60)} minutes ago`;
          } else if (diffInHours < 24) {
            lastUpdated = `${Math.round(diffInHours)} hours ago`;
          } else {
            lastUpdated = `${Math.round(diffInHours / 24)} days ago`;
          }

          // 新增 lastUpdated 欄位到 tweet 物件中
          reply.lastUpdated = lastUpdated;
        });
        return res.json({ status: 'success', replies })
      })
      .catch(error => next(error))
  },
  deleteReply: (req, res) => {
    const replyId = req.params.id
    Reply.findByPk(replyId).then((reply) => {
      reply.destroy().then(() => {
        res.json({
          status: "success",
          message: `admin success delete reply ${replyId}`,
        });
      })
        .catch(error => next(error))
    })
      .catch(error => next(error))
  }
}

module.exports = adminController  