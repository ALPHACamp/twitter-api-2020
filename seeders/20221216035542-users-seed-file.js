'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'root',
      account: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'admin',
      avatar: `https://loremflickr.com/320/240/boy,girl/?random=${Math.floor(Math.random() * 100)}`,
      cover: 'https://loremflickr.com/1500/800/mountain',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user1',
      account: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      avatar: `https://loremflickr.com/320/240/boy,girl/?random=${Math.floor(Math.random() * 100)}`,
      cover: 'https://loremflickr.com/1500/800/mountain',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user2',
      account: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      avatar: `https://loremflickr.com/320/240/boy,girl/?random=${Math.floor(Math.random() * 100)}`,
      cover: 'https://loremflickr.com/1500/800/mountain',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user3',
      account: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      avatar: `https://loremflickr.com/320/240/boy,girl/?random=$${Math.floor(Math.random() * 100)}`,
      cover: 'https://loremflickr.com/1500/800/mountain',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user4',
      account: 'user4',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      avatar: `https://loremflickr.com/320/240/boy,girl/?random=${Math.floor(Math.random() * 100)}`,
      cover: 'https://loremflickr.com/1500/800/mountain',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user5',
      account: 'user5',
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      avatar: `https://loremflickr.com/320/240/boy,girl/?random=${Math.floor(Math.random() * 100)}`,
      cover: 'https://loremflickr.com/1500/800/mountain',
      created_at: new Date(),
      updated_at: new Date()

    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
