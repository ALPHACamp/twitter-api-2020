'use strict'
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      id: '1',
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
      id: '2',
      account: 'user1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: faker.name.findName(),
      introduction: faker.lorem.text(),
      avatar: `https://loremflickr.com/320/240/men,women/?random=${Math.random() * 50}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: '3',
      account: 'user2',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: faker.name.findName(),
      introduction: faker.lorem.text(),
      avatar: `https://loremflickr.com/320/240/men,women/?random=${Math.random() * 50}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: '4',
      account: 'user3',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: faker.name.findName(),
      introduction: faker.lorem.text(),
      avatar: `https://loremflickr.com/320/240/men,women/?random=${Math.random() * 50}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: '5',
      account: 'user4',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: faker.name.findName(),
      introduction: faker.lorem.text(),
      avatar: `https://loremflickr.com/320/240/men,women/?random=${Math.random() * 50}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: '6',
      account: 'user5',
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: faker.name.findName(),
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
