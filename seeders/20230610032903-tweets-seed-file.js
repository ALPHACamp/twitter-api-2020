'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    for (let i = 0; i < users.length; i++) {
      await queryInterface.bulkInsert('Tweets',
        Array.from({ length: 10 }, () => ({
          user_id: Number(users[i].id),
          description: faker.lorem.words(Math.floor((Math.random() * 8)) + 1),
          created_at: new Date(),
          updated_at: new Date()
        }))
      )
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
