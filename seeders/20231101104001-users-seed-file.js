'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      account:'root',
      role:'admin',
      name: 'root',
      introduction: 'This is root account.',
      avatar:`https://loremflickr.com/320/240/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      account:'user1',
      role:'user',
      name: 'user1',
      introduction: 'This is user1 account.',
      avatar:`https://loremflickr.com/320/240/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      account:'user2',
      role:'user',
      name: 'user2',
      introduction: 'This is user2 account.',
      avatar:`https://loremflickr.com/320/240/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      account:'user3',
      role:'user',
      name: 'user3',
      introduction: 'This is user3 account.',
      avatar:`https://loremflickr.com/320/240/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    , {
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      account:'user4',
      role:'user',
      name: 'user4',
      introduction: 'This is user4 account.',
      avatar:`https://loremflickr.com/320/240/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    , {
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      account:'user5',
      role:'user',
      name: 'user5',
      introduction: 'This is user5 account.',
      avatar:`https://loremflickr.com/320/240/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
