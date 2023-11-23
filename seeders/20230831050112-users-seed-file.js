'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      account: 'root',
      name: 'Root',
      password: await bcrypt.hash('12345678', 10),
      introduction: '我是後台管理者',
      avatar: 'https://i.imgur.com/QkbhtP2.png',
      cover: 'https://i.imgur.com/QuhIko5.jpeg',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user1@example.com',
      account: 'user1',
      name: 'User1',
      password: await bcrypt.hash('12345678', 10),
      introduction: '我是使用者 No.1',
      avatar: 'https://i.imgur.com/tqdWV6s.png',
      cover: 'https://i.imgur.com/mSKNzJK.jpeg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user2@example.com',
      account: 'user2',
      name: 'User2',
      password: await bcrypt.hash('111', 10),
      introduction: '我是使用者 No.2',
      avatar: 'https://i.imgur.com/ZbMttzc.png',
      cover: 'https://i.imgur.com/vec36MW.jpeg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user3@example.com',
      account: 'user3',
      name: 'User3',
      password: await bcrypt.hash('111', 10),
      introduction: '我是使用者 No.3',
      avatar: 'https://i.imgur.com/bDjjBpg.png',
      cover: 'https://i.imgur.com/owqXk3Y.jpeg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user4@example.com',
      account: 'user4',
      name: 'User4',
      password: await bcrypt.hash('111', 10),
      introduction: '我是使用者 No.4',
      avatar: 'https://i.imgur.com/AyNBMP5.png',
      cover: 'https://i.imgur.com/Hh40Op7.jpeg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user5@example.com',
      account: 'user5',
      name: 'User5',
      password: await bcrypt.hash('111', 10),
      introduction: '我是使用者 No.5',
      avatar: 'https://i.imgur.com/y7IGwjD.png',
      cover: 'https://i.imgur.com/gtyGMv5.jpeg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
