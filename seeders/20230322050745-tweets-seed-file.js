'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweetAmount = users.length * 10

    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: tweetAmount }, (_, i) => ({
        description: faker.lorem.words(10),
        created_at: new Date(Date.now() + i * 1000),
        updated_at: new Date(Date.now() + i * 1000),
        user_id: users[i % users.length].id
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
