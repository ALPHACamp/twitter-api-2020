'use strict'
const NumOfDummyUser = 15 // 隨機產生User數

// import { faker } from '@faker-js/faker'
const { faker } = require('@faker-js/faker')
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [{
      account: 'root',
      name: 'Root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      introduction: faker.lorem.paragraph({ min: 1, max: 3 }),
      avatar: faker.image.urlLoremFlickr({ width: 224, height: 224, category: 'avatar' }),
      banner: faker.image.urlLoremFlickr({ width: 1024, height: 256 }),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user1',
      name: 'User1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      introduction: faker.lorem.paragraph({ min: 1, max: 3 }),
      avatar: faker.image.urlLoremFlickr({ width: 224, height: 224, category: 'avatar' }),
      banner: faker.image.urlLoremFlickr({ width: 1024, height: 256 }),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }]

    for (let i = 0; i < NumOfDummyUser; i++) {
      users.push({
        account: faker.internet.userName(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await bcrypt.hash('12345678', 10),
        introduction: faker.lorem.paragraph({ min: 1, max: 3 }).substring(0, 160),
        avatar: faker.image.urlLoremFlickr({ width: 224, height: 224, category: 'avatar' }),
        banner: faker.image.urlLoremFlickr({ width: 1024, height: 256 }),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    await queryInterface.bulkInsert('Users', users)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
