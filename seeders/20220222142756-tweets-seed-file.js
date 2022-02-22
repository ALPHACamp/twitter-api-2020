'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // randomly assign 60 tweets to 6 users
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 60 }, () => ({
        UserId: users[Math.floor(Math.random() * users.length)].id,
        description: faker.lorem.text().substring(0, 100),
        image: 'https://loremflickr.com/320/240/nature?random=100',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
