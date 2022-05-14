'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{ // 一次新增三筆資料
      account: 'root',
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/250/250/selfie/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      cover: `https://loremflickr.com/800/350/paradise/?random=${Math.random() * 100}`,
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user1',
      name: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/250/250/selfie/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      cover: `https://loremflickr.com/800/350/paradise/?random=${Math.random() * 100}`,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user2',
      name: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/250/250/selfie/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      cover: `https://loremflickr.com/800/350/paradise/?random=${Math.random() * 100}`,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user3',
      name: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/250/250/selfie/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      cover: `https://loremflickr.com/800/350/paradise/?random=${Math.random() * 100}`,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user4',
      name: 'user4',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/250/250/selfie/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      cover: `https://loremflickr.com/800/350/paradise/?random=${Math.random() * 100}`,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user5',
      name: 'user5',
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/250/250/selfie/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      cover: `https://loremflickr.com/800/350/paradise/?random=${Math.random() * 100}`,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
