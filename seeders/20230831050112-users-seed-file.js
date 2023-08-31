'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      account: 'root',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://i.imgur.com/wwrT8cQ.png',
      cover: 'https://i.imgur.com/4kg6TEu.jpeg',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user1@example.com',
      account: 'user1',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://i.imgur.com/wwrT8cQ.png',
      cover: 'https://i.imgur.com/4kg6TEu.jpeg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user2@example.com',
      account: 'user2',
      password: await bcrypt.hash('111', 10),
      avatar: 'https://i.imgur.com/wwrT8cQ.png',
      cover: 'https://i.imgur.com/4kg6TEu.jpeg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user3@example.com',
      account: 'user3',
      password: await bcrypt.hash('111', 10),
      avatar: 'https://i.imgur.com/wwrT8cQ.png',
      cover: 'https://i.imgur.com/4kg6TEu.jpeg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user4@example.com',
      account: 'user4',
      password: await bcrypt.hash('111', 10),
      avatar: 'https://i.imgur.com/wwrT8cQ.png',
      cover: 'https://i.imgur.com/4kg6TEu.jpeg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user5@example.com',
      account: 'user5',
      password: await bcrypt.hash('111', 10),
      avatar: 'https://i.imgur.com/wwrT8cQ.png',
      cover: 'https://i.imgur.com/4kg6TEu.jpeg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
