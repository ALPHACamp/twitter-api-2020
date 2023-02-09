'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role='user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: tweets.length * 3 }, (_, i) => ({
        comment: faker.lorem.sentence(),
        user_id: users[i % users.length].id,
        tweet_id: tweets[Math.floor(i / 3)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
