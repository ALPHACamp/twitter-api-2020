'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'admin',
      name: 'root',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: faker.name.findName(),
      avatar: `https://loremflickr.com/320/320/headshot/?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/720/240/landscape?random=${Math.random() * 100}`,
      introduction: faker.lorem.words(Math.random() * 10),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: faker.name.findName(),
      avatar: `https://loremflickr.com/320/320/headshot/?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/720/240/landscape?random=${Math.random() * 100}`,
      introduction: faker.lorem.words(Math.random() * 10),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: faker.name.findName(),
      avatar: `https://loremflickr.com/320/320/headshot/?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/720/240/landscape?random=${Math.random() * 100}`,
      introduction: faker.lorem.words(Math.random() * 10),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user4',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: faker.name.findName(),
      avatar: `https://loremflickr.com/320/320/headshot/?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/720/240/landscape?random=${Math.random() * 100}`,
      introduction: faker.lorem.words(Math.random() * 10),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user5',
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: faker.name.findName(),
      avatar: `https://loremflickr.com/320/320/headshot/?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/720/240/landscape?random=${Math.random() * 100}`,
      introduction: faker.lorem.words(Math.random() * 10),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => { // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', {})
  }
}