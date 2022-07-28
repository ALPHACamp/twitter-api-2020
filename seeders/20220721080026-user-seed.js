'use strict'
const faker = require('faker')
const bcrypt = require('bcryptjs')

const PASSWORD = '12345678'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      account: 'root',
      password: await bcrypt.hash(PASSWORD, 10),
      isAdmin: true,
      role: 'admin',
      name: 'root',
      introduction: faker.lorem.text().substring(0, 100),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      account: 'user1',
      password: await bcrypt.hash(PASSWORD, 10),
      isAdmin: false,
      role: 'user',
      name: 'user1',
      introduction: faker.lorem.text().substring(0, 100),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      account: 'user2',
      password: await bcrypt.hash(PASSWORD, 10),
      isAdmin: false,
      role: 'user',
      name: 'user2',
      introduction: faker.lorem.text().substring(0, 100),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user3@example.com',
      account: 'user3',
      password: await bcrypt.hash(PASSWORD, 10),
      isAdmin: false,
      role: 'user',
      name: 'user3',
      introduction: faker.lorem.text().substring(0, 100),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      account: 'user4',
      password: await bcrypt.hash(PASSWORD, 10),
      isAdmin: false,
      role: 'user',
      name: 'user4',
      introduction: faker.lorem.text().substring(0, 100),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user5@example.com',
      account: 'user5',
      password: await bcrypt.hash(PASSWORD, 10),
      isAdmin: false,
      role: 'user',
      name: 'user5',
      introduction: faker.lorem.text().substring(0, 100),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      account: 'user6',
      password: await bcrypt.hash(PASSWORD, 10),
      isAdmin: false,
      role: 'user',
      name: 'user6',
      introduction: faker.lorem.text().substring(0, 100),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      account: 'user7',
      password: await bcrypt.hash(PASSWORD, 10),
      isAdmin: false,
      role: 'user',
      name: 'user7',
      introduction: faker.lorem.text().substring(0, 100),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      account: 'user8',
      password: await bcrypt.hash(PASSWORD, 10),
      isAdmin: false,
      role: 'user',
      name: 'user8',
      introduction: faker.lorem.text().substring(0, 100),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      account: 'user9',
      password: await bcrypt.hash(PASSWORD, 10),
      isAdmin: false,
      role: 'user',
      name: 'user9',
      introduction: faker.lorem.text().substring(0, 100),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      account: 'user10',
      password: await bcrypt.hash(PASSWORD, 10),
      isAdmin: false,
      role: 'user',
      name: 'user10',
      introduction: faker.lorem.text().substring(0, 100),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      account: 'userrr',
      password: await bcrypt.hash(PASSWORD, 10),
      isAdmin: false,
      role: 'user',
      name: 'userrr',
      introduction: faker.lorem.text().substring(0, 100),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
