'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const data = []
    const Textmax = 140

    for (let i = 0; i < users.length; i++) {
      const user = users[i]

      for (let j = 0; j < 10; j++) {
        data.push({
          User_id: user.id,
          description: faker.lorem.text(Textmax),
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }

    await queryInterface.bulkInsert('Tweets', data)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
