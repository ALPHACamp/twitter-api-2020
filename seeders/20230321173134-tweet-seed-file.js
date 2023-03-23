'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query("SELECT id FROM Users WHERE role = 'user';", { type: queryInterface.sequelize.QueryTypes.SELECT })

    await queryInterface.bulkInsert('Tweets', Array.from({ length: 50 }, (_, index) => ({
      description: faker.lorem.text(20),
      created_at: new Date(),
      updated_at: new Date(),
      User_id: users[index % 5].id
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}