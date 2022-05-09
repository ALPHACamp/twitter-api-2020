'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      // admin
      {
        account: 'root',
        name: 'root',
        email: 'root@example.com',
        role: 'admin',
        avatar: 'https://loremflickr.com/280/280/admin',
        cover_image: 'https://loremflickr.com/1280/400/landscape',
        introduction: faker.lorem.sentence(),
        password: bcrypt.hashSync('12345678', 10),
        created_at: new Date(),
        updated_at: new Date()
      },

      // user1
      {
        account: 'user1',
        name: 'user1',
        email: 'user1@example.com',
        role: 'user',
        avatar: 'https://loremflickr.com/280/280/admin',
        cover_image: 'https://loremflickr.com/1280/400/landscape',
        introduction: faker.lorem.sentence(),
        password: bcrypt.hashSync('12345678', 10),
        created_at: new Date(),
        updated_at: new Date()
      },

      // other users
      {
        account: 'austin',
        name: 'austin',
        email: 'austin@example.com',
        role: 'user',
        avatar: 'https://loremflickr.com/280/280/admin',
        cover_image: 'https://loremflickr.com/1280/400/landscape',
        introduction: faker.lorem.sentence(),
        password: bcrypt.hashSync('12345678', 10),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account: 'limecorner',
        name: 'limecorner',
        email: 'limecorner@example.com',
        role: 'user',
        avatar: 'https://loremflickr.com/280/280/admin',
        cover_image: 'https://loremflickr.com/1280/400/landscape',
        introduction: faker.lorem.sentence(),
        password: bcrypt.hashSync('12345678', 10),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account: 'tang',
        name: 'tang',
        email: 'tang@example.com',
        role: 'user',
        password: bcrypt.hashSync('12345678', 10),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account: 'winnie',
        name: 'winnie',
        email: 'winnie@example.com',
        role: 'user',
        password: bcrypt.hashSync('12345678', 10),
        created_at: new Date(),
        updated_at: new Date()
      },
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}