const { sequelize } = require('../models')
const { QueryTypes } = require('sequelize')

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await sequelize.query(`      
      SELECT followshipsPerUser.tweeterId AS id, name, account, avatar, cover, tweetsCount AS tweets, likesTotalCount AS likes, followingsCount AS followings, followersCount AS followers FROM (
        SELECT tweeterId, COUNT(tweetId) AS tweetsCount, SUM(likesCount) AS likesTotalCount FROM (
          SELECT tweets.id AS tweetId, tweets.UserId AS tweeterId, COUNT(likes.id) AS likesCount FROM tweets AS tweets
          LEFT JOIN likes AS likes
          ON likes.TweetId = tweets.id
          GROUP BY tweets.id
        ) AS likesPerTweet
        GROUP BY tweeterId
      ) AS likesAndTweetsPerUser

      INNER JOIN (
        SELECT tweeterId, followingsCount, COUNT(followerId) AS followersCount FROM (
          SELECT users.id AS tweeterId, COUNT(followingId) AS followingsCount FROM users AS users
          LEFT JOIN followships AS followships
          ON followships.followerId = users.id
          GROUP BY users.id
        ) AS followingsPerUser
        LEFT JOIN followships AS followships
        ON followships.followingId = tweeterId
        GROUP BY tweeterId
      ) AS followshipsPerUser
      ON likesAndTweetsPerUser.tweeterId = followshipsPerUser.tweeterId
      
      INNER JOIN users AS users
      ON users.id = followshipsPerUser.tweeterId
      WHERE users.role = 'user'
        
      ORDER BY tweets DESC`,
      {
        type: QueryTypes.SELECT
      })

      res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
