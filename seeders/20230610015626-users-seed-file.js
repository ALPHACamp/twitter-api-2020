'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'root name',
      role: 'admin',
      avatar: 'https://i.imgur.com/6MjaOQm.jpeg',
      banner: 'https://i.imgur.com/3ZH4ZZ8.jpeg',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user1 name',
      role: 'user',
      avatar: 'https://i.imgur.com/0z0x5EK_d.webp?maxwidth=1520&fidelity=grand',
      banner: 'https://i.imgur.com/3ZH4ZZ8.jpeg',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user2 name',
      role: 'user',
      avatar: 'https://i.imgur.com/mwR4POb.jpeg',
      banner: 'https://i.imgur.com/3ZH4ZZ8.jpeg',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user3 name',
      role: 'user',
      avatar: 'https://i.imgur.com/Ghu3yvGb.jpg',
      banner: 'https://i.imgur.com/3ZH4ZZ8.jpeg',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user4',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user4 name',
      role: 'user',
      avatar: 'https://i.imgur.com/fbkd1seb.jpg',
      banner: 'https://i.imgur.com/3ZH4ZZ8.jpeg',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user5',
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user5 name',
      role: 'user',
      avatar: 'https://i.imgur.com/JpxtkDsb.jpg',
      banner: 'https://i.imgur.com/3ZH4ZZ8.jpeg',
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
