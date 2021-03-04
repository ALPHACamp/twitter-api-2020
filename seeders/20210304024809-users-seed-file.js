'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [
      {
        id: 1,
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: 'root1',
        name: faker.name.firstName(),
        avatar: `https://loremflickr.com/320/320/paris,girl/?random=${Math.random() * 100}`,
        introduction: faker.lorem.words(80),
        cover: `https://loremflickr.com/600/300/brazil,rio/?random=${Math.random() * 100}`,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    Array.from({ length: 5 }).map((item, index) => {
      return users.push(
        {
          id: 10 * (index + 1) + 1,
          email: `user${index + 1}@example.com`,
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          account: `user${index + 1}`,
          name: faker.name.firstName(),
          avatar: `https://loremflickr.com/320/320/paris,girl/?random=${Math.random() * 100}`,
          introduction: faker.lorem.words(80),
          cover: `https://loremflickr.com/600/300/brazil,rio/?random=${Math.random() * 100}`,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      )
    })

    await queryInterface.bulkInsert('Users', users, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
