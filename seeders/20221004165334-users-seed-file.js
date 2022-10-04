'use strict'
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'root',
      account: '@root',
      is_admin: true,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user1',
      account: '@user1',
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: faker.name.findName().subString(0, 50),
      account: '@' + faker.name.findName().replace(/\s+/g, ''),
      nickname: faker.name.findName().subString(0, 50),
      avatar: '',
      cover_photo: '',
      intro: faker.lorem.text().subString(0, 160),
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
