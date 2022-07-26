'use strict';
const faker = require('faker')
const seedUsersAmount = 5
const SEED_USER = [{
  account: 'root',
  name: 'root',
  email: 'root@example.com',
  password: '12345678',
  role: 'admin',
  created_at: new Date(),
  updated_at: new Date()
}]
for (let i = 1; i < seedUsersAmount + 1; i++) {
  const user = {
    account: `user${i}`,
    name: `user${i}`,
    email: `user${i}@example.com`,
    password: '12345678',
    avatar: `https://loremflickr.com/320/240/cat/?lock=${Math.random() * 100}`,
    introduction: faker.lorem.sentence(),
    cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 100}`,
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
