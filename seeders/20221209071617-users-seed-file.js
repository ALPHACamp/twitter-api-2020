'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        account: 'root',
        name: 'Root',
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account: 'user1',
        name: 'User1',
        email: 'user1@example.com',
        password: await bcrypt.hash('12345678', 10),
        introduction: faker.lorem.text().substring(0, 160),
        avatar: 'https://loremflickr.com/320/240/logo/?lock=1',
        cover: 'https://loremflickr.com/720/240/landscape/?lock=1',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account: 'user2',
        name: 'User2',
        email: 'user2@example.com',
        password: await bcrypt.hash('12345678', 10),
        introduction: faker.lorem.text().substring(0, 160),
        avatar: 'https://loremflickr.com/320/240/logo/?lock=2',
        cover: 'https://loremflickr.com/720/240/landscape/?lock=2',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account: 'user3',
        name: 'User3',
        email: 'user3@example.com',
        password: await bcrypt.hash('12345678', 10),
        introduction: faker.lorem.text().substring(0, 160),
        avatar: 'https://loremflickr.com/320/240/logo/?lock=3',
        cover: 'https://loremflickr.com/720/240/landscape/?lock=3',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account: 'user4',
        name: 'User4',
        email: 'user4@example.com',
        password: await bcrypt.hash('12345678', 10),
        introduction: faker.lorem.text().substring(0, 160),
        avatar: 'https://loremflickr.com/320/240/logo/?lock=4',
        cover: 'https://loremflickr.com/720/240/landscape/?lock=4',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account: 'user5',
        name: 'User5',
        email: 'user5@example.com',
        password: await bcrypt.hash('12345678', 10),
        introduction: faker.lorem.text().substring(0, 160),
        avatar: 'https://loremflickr.com/320/240/logo/?lock=5',
        cover: 'https://loremflickr.com/720/240/landscape/?lock=5',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
