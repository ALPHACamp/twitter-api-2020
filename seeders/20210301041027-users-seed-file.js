'use strict'
const bcrypt = require('bcryptjs');
const { fake } = require('faker');
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      account: 'root',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'root',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})

    await queryInterface.bulkInsert('Users',
      Array.from({ length: 5 }, (_, i) => ({
        email: `user${i + 1}@example.com`,
        account: `user${i + 1}`,
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: `user${i + 1}`,
        role: 'user',
        avatar: `https://loremflickr.com/320/240/dog/?random=${Math.random() * 100}`,
        cover: `https://loremflickr.com/g/320/240/paris/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}