'use strict'
const faker = require('faker')


const DEFAULT_COUNT = 10

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Tweets', 
    Array.from({ length: users.length * DEFAULT_COUNT }).map((_, i) =>
          ({

            UserId: users[Math.floor(i/DEFAULT_COUNT)].id,
            description: faker.lorem.text(),
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
