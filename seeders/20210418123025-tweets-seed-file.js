'use strict';
const faker = require('faker')
const db = require('../models')
const User = db.User
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll()
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 150 }).map((d, i) =>
      ({
        UserId: users[Math.ceil(Math.random() * (users.length - 1))].id,
        description: faker.lorem.paragraph(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
