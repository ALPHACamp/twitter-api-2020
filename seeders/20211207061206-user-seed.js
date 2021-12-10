'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const mockAdmin = {
      id: 6 * 10,
      account: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'root',
      role: 'admin',
      avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const mockUsers = Array.from({ length: 5 }).map((d, i) => ({
      id: Number(i + 1) * 10,
      account: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: bcrypt.hashSync(String(i + 1), bcrypt.genSaltSync(10), null),
      name: `user${i + 1}`,
      role: 'user',
      avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    await queryInterface.bulkInsert('Users', [...mockUsers, mockAdmin])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}