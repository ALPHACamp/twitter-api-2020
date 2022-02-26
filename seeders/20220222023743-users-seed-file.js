'use strict'
const bcrypt = require('bcrypt')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('Users', [{
        name: 'root',
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        account: 'root',
        role: 'admin',
        avatar: `https://loremflickr.com/320/240/man/?random=${Math.random() * 100}`,
        cover: `https://loremflickr.com/1440/480/city/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text().substring(0, 160),
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('12345678', 10),
        account: 'user1',
        role: 'user',
        avatar: `https://loremflickr.com/320/240/woman/?random=${Math.random() * 100}`,
        cover: `https://loremflickr.com/1440/480/city/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text().substring(0, 160),
        createdAt: new Date(),
        updatedAt: new Date()
      }], {}),
      queryInterface.bulkInsert('Users',
        Array.from({ length: 4 }, () => ({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: bcrypt.hashSync('12345678', 10),
          account: faker.name.findName(),
          role: 'user',
          avatar: `https://loremflickr.com/320/240/man/?random=${Math.random() * 100}`,
          cover: `https://loremflickr.com/1440/480/city/?random=${Math.random() * 100}`,
          introduction: faker.lorem.text().substring(0, 160),
          createdAt: new Date(),
          updatedAt: new Date()
        })), {})
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
