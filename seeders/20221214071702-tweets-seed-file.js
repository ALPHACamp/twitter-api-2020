'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweetsPerUser = 10
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT })

    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: (users.length - 1) * tweetsPerUser }, (_, index) => ({
        User_id: users[Math.floor(index / tweetsPerUser) + 1].id,
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
