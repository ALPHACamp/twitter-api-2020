'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          email: 'root@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'root',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'root',
          cover: faker.image.urlLoremFlickr({ height: 639, width: 200 })
        },
        {
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user1',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user1',
          cover: faker.image.urlLoremFlickr({ height: 639, width: 200 })
        },
        {
          email: 'user2@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user2',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user2',
          cover: faker.image.urlLoremFlickr({ height: 639, width: 200 })
        },
        {
          email: 'user3@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user3',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user3',
          cover: faker.image.urlLoremFlickr({ height: 639, width: 200 })
        },
        {
          email: 'user4@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user4',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user4',
          cover: faker.image.urlLoremFlickr({ height: 639, width: 200 })
        },
        {
          email: 'user5@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user5',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user5',
          cover: faker.image.urlLoremFlickr({ height: 639, width: 200 })
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
