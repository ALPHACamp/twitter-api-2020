'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkInsert('Users', [{
        id: 1,
        email: 'root@example.com',
        password: '12345678',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }, ...Array.from({ length: 5 }, (_, i) => ({
        id: i + 2,
        name: `User${i + 1}`,
        account: `User${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: '12345678',
        cover: 'https://loremflickr.com/598/200/landscape/?random=' + Math.floor(Math.random() * 100),
        avatar: 'https://loremflickr.com/140/140/people/?random=' + Math.floor(Math.random() * 100),
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))])
    } catch (error) {
      console.log(error)
    }

  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('Users', {})
    } catch (error) {
      console.log(error)
    }

  }
};
