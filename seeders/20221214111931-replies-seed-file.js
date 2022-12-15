'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: tweets.length * 3 }, (_, index) => ({
        userId: users[index % users.length].id,
        tweetId: tweets[Math.floor(index / 3)].id,
        comment: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
