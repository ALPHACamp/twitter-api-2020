'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Followships',
    Array.from({length:18}).map((item,index) => ({
      id: index + 1,
      following_id: index + 1,
      follower_id: index + 2,
      created_at: faker.date.between('2022-07-05T00:00:00.000Z', '2022-08-05T00:00:00.000Z'),
      updated_at: new Date()

    }) 
    
    ),{})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
