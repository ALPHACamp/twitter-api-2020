'use strict'
const faker = require('faker')

module.exports = {
  // up: async (queryInterface, Sequelize) => {
  //   await queryInterface.bulkInsert('Tweets',
  //     [1, 2, 3, 4, 5]
  //       .map(item => {
  //         return {
  //           description: faker.lorem.text(),
  //           User_id: item,
  //           created_at: new Date(),
  //           updated_at: new Date()
  //         }
  //       })
  //   )
  // },

  // up: async (queryInterface, Sequelize) => {
  //   await queryInterface.bulkInsert('Tweets',
  //     Array.from({ length: 50 }, () => ({
  //       description: faker.lorem.text(),
  //       User_id: 1,
  //       created_at: new Date(),
  //       updated_at: new Date()
  //     }))
  //   )
  // },

  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets', [{
      description: faker.lorem.text(),
      User_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 3,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 3,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 3,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 3,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 3,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 3,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 3,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 3,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 3,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 3,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 4,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 4,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 4,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 4,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 4,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 4,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 4,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 4,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 4,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 4,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 5,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 5,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 5,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 5,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 5,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 5,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 5,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 5,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 5,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 5,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 6,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 6,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 6,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 6,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 6,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 6,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 6,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 6,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 6,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      description: faker.lorem.text(),
      User_id: 6,
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
