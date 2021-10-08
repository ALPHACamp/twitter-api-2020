const db = require('../models')
const { Tweet, User, Reply, Like, sequelize } = db

async function postTweet(loginUser, description, redis, transaction) {
  try {
    // 確保緩存及資料庫都寫入成功，否則rollback
    const { id } = await Tweet.create({
      UserId: loginUser,
      description,
    }, { transaction })

    const tweet = await Tweet.findOne({
      raw: true, nest: true,
      where: { id },
      attributes: ['id', 'description', 'createdAt', 'updatedAt',
        [
          sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Likes.id'))), 'totalLike'
        ],
        [
          sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Replies.id'))), 'totalReply'
        ],
        [
          sequelize.literal(`EXISTS (SELECT 1 FROM Likes WHERE UserId = ${loginUser} AND TweetId = Tweet.id)`), 'isLiked'
        ]
      ],
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        { model: Reply, attributes: [] },
        { model: Like, attributes: [] }
      ],
      transaction
    })

    redis
      .multi()
      .lpush('tweets', JSON.stringify(tweet))
      .exec()
    return tweet.id
  } catch (err) {
    console.warn(err)
  }
}

module.exports = ({ postTweet })