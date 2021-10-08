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

function getOrPushCache(key, redis, cb) {
  const DEFAULT_EXPIRATION = 300

  return new Promise((resolve, reject) => {
    // 查看是否有緩存
    redis.lrange(key, 0, -1, async (err, data) => {
      if (err) return reject(err)
      if (data.length > 0) {
        // 將陣列中每一筆資料轉回js格式
        data = data.map(d => (JSON.parse(d)))
        return resolve(data)
      }
      // 沒有緩存-> cb，拿到要存取的資料
      const freshData = await cb()
      if (freshData.length > 0) {
        // 將每一筆資料轉成字串，一個一個存入list
        freshData.forEach(data => redis.lpush(key, JSON.stringify(data)))
      }
      redis.expire(key, DEFAULT_EXPIRATION)
      return resolve(freshData)
    })
  })
}

module.exports = ({ getOrPushCache, postTweet })