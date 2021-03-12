'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let userList = []
    for (let i = 1; i <= 15; i++) {
      const list = {
        id: i,
        email: `user${i}@example.com`,
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        role: 'user',
        name: `user${i}`,
        account: `@${faker.lorem.word()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        introduction: faker.lorem.sentence(),
        cover: `https://loremflickr.com/520/320/banner/?lock=${Math.random() * 100}`,
        avatar: `https://loremflickr.com/320/240/user/?lock=${Math.random() * 100}`
      }
      userList.push(list)
    }
    const admin = {
      id: 999,
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      name: 'root',
      account: '@Boss',
      createdAt: new Date(),
      updatedAt: new Date(),
      cover: `https://loremflickr.com/520/320/banner/?lock=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/320/240/user/?lock=${Math.random() * 100}`
    }
    userList.push(admin)

    await queryInterface.bulkInsert('Users', userList)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
