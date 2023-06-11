'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
const USERS_INTRO_LIMIT = 160
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'root',
      email: 'root@example.com',
      account: 'root',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/320/240/marvel/?random=${Math.random() * 100}&lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, USERS_INTRO_LIMIT),
      role: 'admin',
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    }, {
      name: 'user1',
      email: 'user1@example.com',
      account: 'user1',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/320/240/marvel/?random=${Math.random() * 100}&lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, USERS_INTRO_LIMIT),
      role: 'user',
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    }, {
      name: 'user2',
      email: 'user2@example.com',
      account: 'user2',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/320/240/marvel/?random=${Math.random() * 100}&lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, USERS_INTRO_LIMIT),
      role: 'user',
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    }, {
      name: 'user3',
      email: 'user3@example.com',
      account: 'user3',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/320/240/marvel/?random=${Math.random() * 100}&lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, USERS_INTRO_LIMIT),
      role: 'user',
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    }, {
      name: 'user4',
      email: 'user4@example.com',
      account: 'user4',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/320/240/marvel/?random=${Math.random() * 100}&lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, USERS_INTRO_LIMIT),
      role: 'user',
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    }, {
      name: 'user5',
      email: 'user5@example.com',
      account: 'user5',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/320/240/marvel/?random=${Math.random() * 100}&lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, USERS_INTRO_LIMIT),
      role: 'user',
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    }, {
      name: 'user6',
      email: 'user6@example.com',
      account: 'user6',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/320/240/marvel/?random=${Math.random() * 100}&lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, USERS_INTRO_LIMIT),
      role: 'user',
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    }, {
      name: 'user7',
      email: 'user7@example.com',
      account: 'user7',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/320/240/marvel/?random=${Math.random() * 100}&lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, USERS_INTRO_LIMIT),
      role: 'user',
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    }, {
      name: 'user8',
      email: 'user8@example.com',
      account: 'user8',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/320/240/marvel/?random=${Math.random() * 100}&lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, USERS_INTRO_LIMIT),
      role: 'user',
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    }, {
      name: 'user9',
      email: 'user9@example.com',
      account: 'user9',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/320/240/marvel/?random=${Math.random() * 100}&lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, USERS_INTRO_LIMIT),
      role: 'user',
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    }, {
      name: 'user10',
      email: 'user10@example.com',
      account: 'user10',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/320/240/marvel/?random=${Math.random() * 100}&lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, USERS_INTRO_LIMIT),
      role: 'user',
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
