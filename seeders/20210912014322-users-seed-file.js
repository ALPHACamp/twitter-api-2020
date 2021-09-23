'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      name: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/320/240/paris,girl/?lock=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user1',
      name: 'user1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/320/240/paris,girl/?lock=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user2',
      name: 'user2',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/320/240/paris,girl/?lock=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: 'user3',
      name: 'user3',
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/320/240/paris,girl/?lock=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: '*)@(&@*!',
      name: '*)@(&@*!',
      email: '@(^*&!)@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/320/240/paris,girl/?lock=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      email: 'aaa@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/320/240/paris,girl/?lock=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}