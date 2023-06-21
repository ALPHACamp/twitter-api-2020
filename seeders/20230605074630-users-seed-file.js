'use strict'
const faker = require('faker')
const bcrypt = require('bcryptjs')
const background = 'https://images.unsplash.com/photo-1580436541340-36b8d0c60bae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'root',
        avatar: 'https://loremflickr.com/320/240/person/?random=100',
        introduction: faker.lorem.text(),
        role: 'admin',
        account: 'root',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user1@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user1',
        avatar: 'https://loremflickr.com/320/240/person/?random=101',
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user1',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user2@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user2',
        avatar: 'https://loremflickr.com/320/240/person/?random=102',
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user2',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user3@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user3',
        avatar: 'https://loremflickr.com/320/240/person/?random=103',
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user3',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user4@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user4',
        avatar: 'https://loremflickr.com/320/240/person/?random=104',
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user4',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user5@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user5',
        avatar: 'https://loremflickr.com/320/240/person/?random=105',
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user5',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user6@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user6',
        avatar: 'https://loremflickr.com/320/240/person/?random=105',
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user6',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user7@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user7',
        avatar: 'https://loremflickr.com/320/240/person/?random=105',
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user7',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user8@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user8',
        avatar: 'https://loremflickr.com/320/240/person/?random=105',
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user8',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user9@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user9',
        avatar: 'https://loremflickr.com/320/240/person/?random=105',
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user9',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user10@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user10',
        avatar: 'https://loremflickr.com/320/240/person/?random=105',
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user10',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user11@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user11',
        avatar: 'https://loremflickr.com/320/240/person/?random=105',
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user11',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user12@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user12',
        avatar: 'https://loremflickr.com/320/240/person/?random=105',
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user12',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user13@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user13',
        avatar: 'https://loremflickr.com/320/240/person/?random=105',
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user13',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user14@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user14',
        avatar: 'https://loremflickr.com/320/240/person/?random=105',
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user14',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user15@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user15',
        avatar: 'https://loremflickr.com/320/240/person/?random=105',
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user15',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
