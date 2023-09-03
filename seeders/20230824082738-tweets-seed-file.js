'use strict'
const tweetsSeeds = require('./seeds/tweetsSeeds.json')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 使用SQL查詢Users裡role:user的id
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const userIds = users.map(user => user.id)
    const tweetsToInsert = []

    userIds.forEach(userId => {
      const userTweets = tweetsSeeds.slice(0, 10)
      userTweets.forEach(tweet => {
        const tweetData = {
          UserId: userId,
          description: tweet.description,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        tweetsToInsert.push(tweetData)
      })
    })

    await queryInterface.bulkInsert('Tweets', tweetsToInsert, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
