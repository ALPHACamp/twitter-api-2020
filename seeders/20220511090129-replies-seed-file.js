'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 150 }).map((item, index) => ({
        id: index + 1,
        user_id: Math.ceil(Math.random() * 9) + 1,
        tweet_id: Math.ceil(( index + 1 ) / 3 ),
        comment: faker.lorem.text().substring(0, 50),
        created_at: new Date(),
        updated_at: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {
      where: {},
      truncate: true,
    })
  },
}
