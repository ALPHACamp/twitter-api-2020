'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
const USERS_INTRO_LIMIT = 160
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'root',
      email: 'root@example.com',
      account: 'root',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg',
      backgroundImage: '',
      introduction: faker.lorem.text().substring(0, USERS_INTRO_LIMIT),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'user1',
      email: 'user1@example.com',
      account: 'user1',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg',
      backgroundImage: '',
      introduction: faker.lorem.text().substring(0, USERS_INTRO_LIMIT),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'user2',
      email: 'user2@example.com',
      account: 'user2',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg',
      backgroundImage: '',
      introduction: faker.lorem.text().substring(0, USERS_INTRO_LIMIT),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'user3',
      email: 'user3@example.com',
      account: 'user3',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg',
      backgroundImage: '',
      introduction: faker.lorem.text().substring(0, USERS_INTRO_LIMIT),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'user4',
      email: 'user4@example.com',
      account: 'user4',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg',
      backgroundImage: '',
      introduction: faker.lorem.text().substring(0, USERS_INTRO_LIMIT),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'user5',
      email: 'user5@example.com',
      account: 'user5',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg',
      backgroundImage: '',
      introduction: faker.lorem.text().substring(0, USERS_INTRO_LIMIT),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
