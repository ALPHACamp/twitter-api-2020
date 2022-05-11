'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      id: 6,
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'admin',
      name: 'root',
      account: 'root',
      avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
      introduction: faker.lorem.sentence(),
      cover: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      id: 1,
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user1',
      account: 'user1',
      avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
      introduction: faker.lorem.sentence(),
      cover: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      id: 2,
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user2',
      account: 'user2',
      avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
      introduction: faker.lorem.sentence(),
      cover: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      id: 3,
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user3',
      account: 'user3',
      avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
      introduction: faker.lorem.sentence(),
      cover: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      id: 4,
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user4',
      account: 'user4',
      avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
      introduction: faker.lorem.sentence(),
      cover: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      id: 5,
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user5',
      account: 'user5',
      avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
      introduction: faker.lorem.sentence(),
      cover: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {}) // 第三個參數可以指定 where 條件，但這裡因為全部刪除，所以只傳入空物件。
  }
}
