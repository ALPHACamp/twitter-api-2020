'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role='user';", { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Tweets', Array.from({ length: users.length * 10 }, (_, i) => ({
      User_id: users[Math.floor(i % users.length)].id,
      description: faker.lorem.sentence(6),
      created_at: faker.date.between('2023-03-20T00:00:00.000Z', '2023-03-28T00:00:00.000Z'),
      updated_at: new Date()
    })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
