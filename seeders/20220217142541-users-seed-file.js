'use strict';
const faker = require('faker')
const bcrypt = require('bcryptjs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('Users', [{
        id: 1,
        email: 'root@example.com',
        account: 'root',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'root',
        avatar: `https://loremflickr.com/320/320/model/?lock=${Math.random() * 100}`,
        cover: `https://loremflickr.com/600/200/nature/?lock=${Math.random() * 100}`,
        introduction: faker.lorem.sentence().substring(0, 160),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }]),
      queryInterface.bulkInsert('Users',
        Array.from({ length: 5 }).map((_, i) => ({
          id: i * 10 + 11,
          email: `user${i + 1}@example.com`,
          account: `user${i + 1}`,
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          avatar: `https://loremflickr.com/320/320/model/?lock=${Math.random() * 100}`,
          cover: `https://loremflickr.com/600/200/nature/?lock=${Math.random() * 100}`,
          introduction: faker.lorem.sentence().substring(0, 160),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}