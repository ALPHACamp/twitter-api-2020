'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // create 3 replies for each tweet
    const replies = []
    for (const tweet of tweets) {
      for (let i = 1; i <= 3; i++) {
        replies.push({
          user_id: users[Math.floor(Math.random() * users.length)].id,
          tweet_id: tweet.id,
          comment: faker.lorem.text(),
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }
    await queryInterface.bulkInsert('Replies', replies, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
