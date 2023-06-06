'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }, () => {
        const randomUser = users[Math.floor(Math.random() * users.length)]
        const user = {
          email: randomUser.email,
          description: faker.lorem.text(),
          created_at: new Date(),
          updated_at: new Date(),
          user_id: randomUser.id
        }
        return user
      }))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
