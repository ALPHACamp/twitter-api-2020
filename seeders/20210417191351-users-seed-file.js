'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'root',
          email: 'root@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          role: true,
          avatar: 'https://i.imgur.com/q6bwDGO.png',
          introduction: faker.lorem.text().substring(0, 50),
          account: 'root',
          cover: 'https://i.imgur.com/1jDf2Me.png',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user1',
          email: 'user1@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          role: false,
          avatar: 'https://i.imgur.com/q6bwDGO.png',
          introduction: faker.lorem.text().substring(0, 50),
          account: 'user1',
          cover: 'https://i.imgur.com/1jDf2Me.png',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user2',
          email: 'user2@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          role: false,
          avatar: 'https://i.imgur.com/q6bwDGO.png',
          introduction: faker.lorem.text().substring(0, 50),
          account: 'user2',
          cover: 'https://i.imgur.com/1jDf2Me.png',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
