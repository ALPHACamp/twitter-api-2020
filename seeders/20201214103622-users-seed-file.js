'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bcrypt = require('bcryptjs')
    const users = []
    for (let i = 1; i < 16; i++) {
      users.push({
        name: `user${i}`,
        account: `user${i}`,
        email: `user${i}@example.com`,
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        role: 'user',
        introduction: faker.lorem.text(),
        avatar: `https://loremflickr.com/320/240/corgi?lock=${Math.floor(Math.random() * 50)}`,
        cover: `https://loremflickr.com/320/240/corgi?lock=${Math.floor(Math.random() * 50)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    const admin = [{
      name: 'root',
      account: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      role: 'admin',
      introduction: faker.lorem.text(),
      avatar: `https://loremflickr.com/320/240/corgi?lock=${Math.floor(Math.random() * 50)}`,
      cover: `https://loremflickr.com/320/240/corgi?lock=${Math.floor(Math.random() * 50)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }]
    const userSeeds = admin.concat(users)
    await queryInterface.bulkInsert('Users', userSeeds)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};