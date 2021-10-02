'use strict';
const faker = require('faker')
const { User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await User.findAll({ attributes: ['id'] })
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 40 }).map((d, i) =>
      ({
        description: faker.lorem.text(),
        UserId: user[~~(i / 10) + 1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
