'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE Users.role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweetDada = []
    users.forEach(user => {
      for (let i = 0; i < 10; i++) {
        tweetDada.push({
          user_id: user.id,
          description: faker.lorem.text().substring(0, 140),
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    })
    await queryInterface.bulkInsert('Tweets', tweetDada)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
