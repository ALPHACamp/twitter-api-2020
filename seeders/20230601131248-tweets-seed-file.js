'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role != "admin";',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    await queryInterface.bulkInsert(
      'Tweets',
      // 每個使用者有 10 篇 tweet
      Array.from(users, user => (
        Array.from({ length: 10 }, () => ({
          description: faker.lorem.paragraph(),
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      )).flat()
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
