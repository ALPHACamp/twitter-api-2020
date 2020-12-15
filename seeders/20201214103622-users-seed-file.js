'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bcrypt = require('bcryptjs')
    await queryInterface.bulkInsert('Users', [
      {
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        name: 'root',
        avatar: `https://loremflickr.com/320/240/corgi?lock=${Math.floor(Math.random() * 50)}`,
        introduction: faker.lorem.text(),
        role: 'admin',
        account: 'root',
        cover: `https://loremflickr.com/320/240/corgi?lock=${Math.floor(Math.random() * 50)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        name: 'user1',
        avatar: `https://loremflickr.com/320/240/corgi?lock=${Math.floor(Math.random() * 50)}`,
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user1',
        cover: `https://loremflickr.com/320/240/corgi?lock=${Math.floor(Math.random() * 50)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        name: 'user2',
        avatar: `https://loremflickr.com/320/240/corgi?lock=${Math.random() * 50}`,
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user2',
        cover: `https://loremflickr.com/320/240/corgi?lock=${Math.random() * 50}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user3@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        name: 'user3',
        avatar: `https://loremflickr.com/320/240/corgi?lock=${Math.random() * 50}`,
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user3',
        cover: `https://loremflickr.com/320/240/corgi?lock=${Math.random() * 50}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user4@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        name: 'user4',
        avatar: `https://loremflickr.com/320/240/corgi?lock=${Math.random() * 50}`,
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user4',
        cover: `https://loremflickr.com/320/240/corgi?lock=${Math.random() * 50}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user5@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        name: 'user5',
        avatar: `https://loremflickr.com/320/240/corgi?lock=${Math.random() * 50}`,
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user5',
        cover: `https://loremflickr.com/320/240/corgi?lock=${Math.random() * 50}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};