'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
const users = Array.from({ length: 10 }, (_, i) => ({
  account: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  password: bcrypt.hashSync('12345678', 10),
  name: `user${i + 1}`,
  avatar: `https://loremflickr.com/320/240/cat?random=${Math.random() * 100}`,
  introduction: faker.lorem.text(),
  role: 'user',
  cover: `https://loremflickr.com/400/200/mountain?random=${Math.random() * 100}`,
  created_at: new Date(),
  updated_at: new Date()
}))
users.push({
  account: 'root',
  email: 'root@example.com',
  password: bcrypt.hashSync('12345678', 10),
  name: 'root',
  avatar: `https://loremflickr.com/320/240/cat?random=${Math.random() * 100}`,
  introduction: faker.lorem.text(),
  role: 'admin',
  cover: `https://loremflickr.com/400/200/mountain?random=${Math.random() * 100}`,
  created_at: new Date(),
  updated_at: new Date()
})

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users',
      users
      , {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
