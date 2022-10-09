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
      profile_photo: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
      cover_photo: 'https://i.imgur.com/t0YRqQH.jpg',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user1',
      account: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      profile_photo: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
      cover_photo: 'https://i.imgur.com/t0YRqQH.jpg',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user2',
      account: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      profile_photo: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
      cover_photo: 'https://i.imgur.com/t0YRqQH.jpg',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user3',
      account: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      profile_photo: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
      cover_photo: 'https://i.imgur.com/t0YRqQH.jpg',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user4',
      account: 'user4',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      profile_photo: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
      cover_photo: 'https://i.imgur.com/t0YRqQH.jpg',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user5',
      account: 'user5',
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      profile_photo: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
      cover_photo: 'https://i.imgur.com/t0YRqQH.jpg',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user6',
      account: 'user6',
      email: 'user6@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      profile_photo: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
      cover_photo: 'https://i.imgur.com/t0YRqQH.jpg',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user7',
      account: 'user7',
      email: 'user7@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      profile_photo: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
      cover_photo: 'https://i.imgur.com/t0YRqQH.jpg',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user8',
      account: 'user8',
      email: 'user8@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      profile_photo: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
      cover_photo: 'https://i.imgur.com/t0YRqQH.jpg',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user9',
      account: 'user9',
      email: 'user9@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      profile_photo: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
      cover_photo: 'https://i.imgur.com/t0YRqQH.jpg',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user10',
      account: 'user10',
      email: 'user10@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      profile_photo: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
      cover_photo: 'https://i.imgur.com/t0YRqQH.jpg',
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
