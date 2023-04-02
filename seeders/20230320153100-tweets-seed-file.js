'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT * FROM Users WHERE role = \'user\'',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 50 }).map((_, index) => ({
        UserId: users[index % 5].id,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, { truncate: true })
  }
}
