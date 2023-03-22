'use strict'
const { User, Tweet } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweetData = await Tweet.findAndCountAll()
    const userData = await User.findAndCountAll()

    let LikeSeedData = []
    // 隨機分派user_id tweet_id (先不考慮重覆)
    for (let i = 0; i < tweetData.count * userData.count; i++) {
      LikeSeedData.push({
        user_id: userData.rows[Math.floor(Math.random() * userData.count)].id,
        tweet_id: tweetData.rows[Math.floor(Math.random() * tweetData.count)].id,
        created_at: new Date(),
        updated_at: new Date()
      })
    }

    // filter重覆的 user_id + tweet_id
    LikeSeedData = LikeSeedData.filter((item, index, self) =>
      index === self.findIndex(target => (
        target.user_id === item.user_id && target.tweet_id === item.tweet_id
      ))
    )

    await queryInterface.bulkInsert('Likes', LikeSeedData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes')
  }
}
