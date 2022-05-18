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
        introduction: faker.lorem.sentence(3),
        password: bcrypt.hashSync('12345678', 10),
        created_at: new Date(),
        updated_at: new Date()
      },

      // users
      {
        account: 'user1',
        name: 'user1',
        email: 'user1@example.com',
        role: 'user',
        avatar: 'https://loremflickr.com/280/280/admin',
        cover_image: 'https://loremflickr.com/1280/400/landscape',
        introduction: faker.lorem.sentence(4),
        password: bcrypt.hashSync('12345678', 10),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account: 'user2',
        name: 'user2',
        email: 'user2@example.com',
        role: 'user',
        introduction: faker.lorem.sentence(4),
        password: bcrypt.hashSync('12345678', 10),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account: 'user3',
        name: 'user3',
        email: 'user3@example.com',
        role: 'user',
        avatar: 'https://loremflickr.com/280/280/admin',
        cover_image: 'https://loremflickr.com/1280/400/landscape',
        introduction: faker.lorem.sentence(4),
        password: bcrypt.hashSync('12345678', 10),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account: 'user4',
        name: 'user4',
        email: 'user4@example.com',
        role: 'user',
        avatar: 'https://loremflickr.com/280/280/admin',
        cover_image: 'https://loremflickr.com/1280/400/landscape',
        introduction: faker.lorem.sentence(4),
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
        introduction: faker.lorem.sentence(3),
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
        introduction: faker.lorem.sentence(5),
        password: bcrypt.hashSync('12345678', 10),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account: 'tang',
        name: 'tang',
        email: 'tang@example.com',
        role: 'user',
        avatar: 'https://loremflickr.com/280/280/admin',
        cover_image: 'https://loremflickr.com/1280/400/landscape',
        introduction: faker.lorem.sentence(5),
        password: bcrypt.hashSync('12345678', 10),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account: 'winnie',
        name: 'winnie',
        email: 'winnie@example.com',
        avatar: 'https://loremflickr.com/280/280/admin',
        cover_image: 'https://loremflickr.com/1280/400/landscape',
        role: 'user',
        introduction: faker.lorem.sentence(3),
        password: bcrypt.hashSync('12345678', 10),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
