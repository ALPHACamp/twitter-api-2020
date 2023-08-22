'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = []
    // eslint-disable-next-line array-callback-return
    Array.from({ length: 10 }).map((user, i) => {
      for (let j = 0; j < 10; ++j) {
        data.push({
          id: j * 10 + i + 1,
          description: faker.lorem.text(140),
          created_at: new Date(),
          updated_at: new Date(),
          User_id: i + 1
        })
      }
    })
    await queryInterface.bulkInsert('Tweets', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
