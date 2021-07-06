'use strict';
const faker = require('faker')
const { User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = await User.findAll({ attributes: ['id'] })
    const idList = data.slice(1)

    await queryInterface.bulkInsert('Tweets', Array.from({ length: 50 }, (v, i) => ({
      UserId: idList[~~(i / 10)].id,
      description: faker.lorem.word(),
      createdAt: new Date(),
      updatedAt: new Date()
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, { truncate: true })
  }
};
