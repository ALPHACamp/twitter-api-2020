'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [tweets, users] = await Promise.all([
      queryInterface.sequelize.query(
        'SELECT id FROM Tweets;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ),
      queryInterface.sequelize.query(
        "SELECT id FROM Users WHERE role <> 'admin'",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    ])
    const eachUserTweetsCount = 3
    const repliedTweets = []
    for (let i = 0; i < 150; i++) {
      const randomUser = Math.floor(Math.random() * users.length)
      repliedTweets.push({
        UserId: users[randomUser].id,
        TweetId: tweets[Math.floor(i / eachUserTweetsCount)].id,
        comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    queryInterface.bulkInsert('Replies', repliedTweets)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
