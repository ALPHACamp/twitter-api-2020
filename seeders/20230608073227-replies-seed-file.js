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
      let comment = faker.lorem.text()
      if (comment.length > 140) {
        comment = comment.slice(0, 140)
      }
      const randomUser = Math.floor(Math.random() * users.length)
      repliedTweets.push({
        UserId: users[randomUser].id,
        TweetId: tweets[Math.floor(i / eachUserTweetsCount)].id,
        comment,
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
