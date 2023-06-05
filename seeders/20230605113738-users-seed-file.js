'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'root',
      account: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://imgur.com/5OL5wJt.png',
      cover_photo: 'https://imgur.com/JzwDxR1.png',
      introduction: faker.lorem.text(),
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user1',
      account: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://imgur.com/5OL5wJt.png',
      cover_photo: 'https://imgur.com/hJ4J9gn.png',
      introduction: faker.lorem.text(),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user2',
      account: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://imgur.com/5OL5wJt.png',
      cover_photo: 'https://imgur.com/hJ4J9gn.png',
      introduction: faker.lorem.text(),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user3',
      account: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://imgur.com/5OL5wJt.png',
      cover_photo: 'https://imgur.com/hJ4J9gn.png',
      introduction: faker.lorem.text(),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user4',
      account: 'user4',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://imgur.com/5OL5wJt.png',
      cover_photo: 'https://imgur.com/hJ4J9gn.png',
      introduction: faker.lorem.text(),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user5',
      account: 'user5',
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://imgur.com/5OL5wJt.png',
      cover_photo: 'https://imgur.com/hJ4J9gn.png',
      introduction: faker.lorem.text(),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
