'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 50 }).map((item, index) => ({
        id: index + 1,
        user_id: Math.ceil(( index + 1) / 10) + 1,
        description: faker.lorem.text().substring(0, 140),
        like_count: 5,
        reply_count: 3,
        created_at: new Date(),
        updated_at: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {
      where: {},
      truncate: true,
    })
  },
}
