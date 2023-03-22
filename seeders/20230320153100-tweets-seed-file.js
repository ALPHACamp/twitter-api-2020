'use strict'
const faker = require("faker");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT * FROM Users WHERE role = 'user'`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 50 }, (num, i) => ({
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
        UserId:
          users[ i % 5 ].id
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
