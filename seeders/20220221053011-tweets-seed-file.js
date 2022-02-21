'use strict'
const faker = require('faker')
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Tweets', [{
      userId: users[Math.floor(Math.random() * users.length)].id,
      content: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
