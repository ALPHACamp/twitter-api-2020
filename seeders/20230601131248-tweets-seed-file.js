'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 10 }, () => ({
        description: faker.lorem.paragraph(),
        userId: users[Math.floor(Math.random() * users.length)].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
