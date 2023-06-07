'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{ // 一次新增三筆資料
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: true,
      name: 'root',
      avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: false,
      name: 'user1',
      avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
      }, {
        email: 'user2@example.com',
        password: await bcrypt.hash('12345678', 10),
        role: false,
        name: 'user2',
        avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user3@example.com',
        password: await bcrypt.hash('12345678', 10),
        role: false,
        name: 'user3',
        avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user4@example.com',
        password: await bcrypt.hash('12345678', 10),
        role: false,
        name: 'user4',
        avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }, 
      {
        email: 'user5@example.com',
        password: await bcrypt.hash('12345678', 10),
        role: false,
        name: 'user5',
        avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
};
