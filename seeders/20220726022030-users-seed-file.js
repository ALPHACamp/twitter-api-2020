'use strict'
const faker = require('faker')
const bcrypt = require('bcryptjs')
const seedUsersAmount = 5

const SEED_USER = [{
  account: 'root',
  name: 'root',
  email: 'root@example.com',
  password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
  role: 'admin',
  created_at: new Date(),
  updated_at: new Date()
}]
for (let i = 1; i < seedUsersAmount + 1; i++) {
  const user = {
    account: `user${i}`,
    name: `user${i}`,
    email: `user${i}@example.com`,
    password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
    avatar: `https://loremflickr.com/320/240/cat/?lock=${Math.random() * 100}`,
    introduction: faker.lorem.sentence(),
    cover: 'https://i.imgur.com/hCJiDle.png',
    role: 'user',
    created_at: new Date(),
    updated_at: new Date()
  }
  SEED_USER.push(user)
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [...SEED_USER], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
