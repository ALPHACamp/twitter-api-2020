'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: 'root',
        introduction: faker.lorem.text().substring(0, 160),
        avatar: 'https://loremflickr.com/320/240/people',
        cover: 'https://loremflickr.com/800/600/paris',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      ...Array.from({ length: 5 }, (_, i) => ({
        name: faker.name.findName(),
        email: `user${ i + 1 }@example.com`,
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: `user${ i + 1 }`,
        introduction: faker.lorem.text().substring(0, 160),
        avatar: 'https://loremflickr.com/320/240/people',
        cover: 'https://loremflickr.com/800/600/paris',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
