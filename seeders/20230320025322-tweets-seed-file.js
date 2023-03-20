'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query("SELECT id FROM Users WHERE role='user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    return await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }, (_, i) => ({
        User_Id: users[(i % users.length)].id,
        description: faker.lorem.text().substring(0, 140),
        created_at: new Date(),
        updated_at: new Date()
      })), {})
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('Tweets', {})
  }
}
