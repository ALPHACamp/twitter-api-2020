'use strict'
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'root',
      introduction: faker.lorem.text(),
      avatar: `https://loremflickr.com/320/240/men,women/?random=${Math.random() * 50}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user1',
      introduction: faker.lorem.text(),
      avatar: `https://loremflickr.com/320/240/men,women/?random=${Math.random() * 50}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user2',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user2',
      introduction: faker.lorem.text(),
      avatar: `https://loremflickr.com/320/240/men,women/?random=${Math.random() * 50}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
