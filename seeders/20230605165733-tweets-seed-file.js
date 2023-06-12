'use strict'
const faker = require('faker')
module.exports = {
  up: async(queryInterface, Sequelize) => {
        const users = await queryInterface.sequelize.query('SELECT id FROM Users;', {
            type: queryInterface.sequelize.QueryTypes.SELECT
            })
        const tweets = []
        for (const user of users) {
          for (let i = 0; i < 3; i++) {
            tweets.push ({
              UserId: user.id,
              description: faker.lorem.text(),
              createdAt: new Date(),
              updatedAt: new Date()
            })
          }
        }

        await queryInterface.bulkInsert('Tweets', tweets)
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
