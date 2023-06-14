'use strict'

module.exports = {
  up: async(queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    const existingPairs = new Set() // 用來儲存已存在的 UserId-TweetId 對

    const fakeLikes = Array.from({ length: 30 }, () => {
      const userId = users[Math.floor(Math.random() * users.length)].id
      const tweetId = tweets[Math.floor(Math.random() * tweets.length)].id

      const pair = `${userId}-${tweetId}` // 建立 UserId-TweetId 對

      // 檢查是否已存在相同的 UserId-TweetId 對，若存在則重新選取
      if (existingPairs.has(pair)) {
        return null
      }

      existingPairs.add(pair) // 將新的 UserId-TweetId 對加入已存在的集合

      return {
        UserId: userId,
        TweetId: tweetId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }).filter(like => like !== null) 

    await queryInterface.bulkInsert('Likes', fakeLikes)
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
