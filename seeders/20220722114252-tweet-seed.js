'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: users.length * 10 }, () =>
        ({
          UserId: users[Math.floor(Math.random() * (users.length - 1)) + 1].id,
          description: faker.lorem.text().substring(0, 50),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
