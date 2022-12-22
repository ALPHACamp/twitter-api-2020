'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const userTweets = []

    users.forEach(userId => {
      for (let i = 0; i < 10; i++) {
        userTweets.push({
          user_id: userId.id,
          description: faker.lorem.text(),
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    })

    await queryInterface.bulkInsert('Tweets', userTweets, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
