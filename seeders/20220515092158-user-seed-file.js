'use strict'
const faker = require('faker')
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'root',
      role: 'admin',
      avatar: 'https://loremflickr.com/320/240/person',
      cover: 'https://loremflickr.com/320/240/landscape',
      introduction: faker.lorem.text().substring(0, 50),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user1',
      role: 'user',
      avatar: 'https://loremflickr.com/320/240/person',
      cover: 'https://loremflickr.com/320/240/landscape',
      introduction: faker.lorem.text().substring(0, 50),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user2',
      role: 'user',
      avatar: 'https://loremflickr.com/320/240/person',
      cover: 'https://loremflickr.com/320/240/landscape',
      introduction: faker.lorem.text().substring(0, 50),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user3',
      role: 'user',
      avatar: 'https://loremflickr.com/320/240/person',
      cover: 'https://loremflickr.com/320/240/landscape',
      introduction: faker.lorem.text().substring(0, 50),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: 'user4',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user4',
      role: 'user',
      avatar: 'https://loremflickr.com/320/240/person',
      cover: 'https://loremflickr.com/320/240/landscape',
      introduction: faker.lorem.text().substring(0, 50),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: 'user5',
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user5',
      role: 'user',
      avatar: 'https://loremflickr.com/320/240/person',
      cover: 'https://loremflickr.com/320/240/landscape',
      introduction: faker.lorem.text().substring(0, 50),
      createdAt: new Date(),
      updatedAt: new Date()
    } 
  ])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
