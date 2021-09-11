'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      name: 'root',
      avatar: `https://loremflickr.com/240/240/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      account: '@root',
      cover: `https://loremflickr.com/720/240/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user1',
      avatar: `https://loremflickr.com/240/240/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      account: '@user1',
      cover: `https://loremflickr.com/720/240/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user2',
      avatar: `https://loremflickr.com/240/240/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      account: '@user2',
      cover: `https://loremflickr.com/720/240/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user3',
      avatar: `https://loremflickr.com/240/240/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      account: '@user3',
      cover: `https://loremflickr.com/720/240/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user4',
      avatar: `https://loremflickr.com/240/240/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      account: '@user4',
      cover: `https://loremflickr.com/720/240/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user5',
      avatar: `https://loremflickr.com/240/240/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      account: '@user5',
      cover: `https://loremflickr.com/720/240/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}