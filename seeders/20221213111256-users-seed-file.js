'use strict'

const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')

const password = '12345678'
const profileUrl = 'https://loremflickr.com/140/140/woman,man/?random='
const coverUrl = 'https://loremflickr.com/640/200/nature/?random='

const root = {
  name: 'root',
  email: 'root@example.com',
  password: bcrypt.hashSync(password),
  avatar: profileUrl + String(Math.random() * 100),
  cover: coverUrl + String(Math.random() * 100),
  introduction: faker.lorem.sentence(),
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
}

const users = Array.from({ length: 5 }, (_, index) => ({
  name: 'user' + String(index + 1),
  email: 'user' + String(index + 1) + '@example.com',
  password: bcrypt.hashSync(password),
  avatar: profileUrl + String(Math.random() * 100),
  cover: coverUrl + String(Math.random() * 100),
  introduction: faker.lorem.sentence(),
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date()
}))

users.push(root)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', users, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
