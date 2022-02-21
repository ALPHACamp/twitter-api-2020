'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 10 }, () => ({
      UserId: users[Math.floor(Math.random() * users.length)].id,
      TweetId: users[Math.floor(Math.random() * users.length)].id,
      comment: faker.lorem.text().substring(0, 20),
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
