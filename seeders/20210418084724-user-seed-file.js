'use strict';
const faker = require('faker')
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: '@root',
      email: "root@example.com",
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'root',
      avatar: `https://loremflickr.com/320/240/people/?lock=${Math.ceil(Math.random() * 1000)}`,
      cover: `https://loremflickr.com/800/300/restaurant,food/?lock=${Math.ceil(Math.random() * 1000)}`,
      introduction: faker.lorem.sentences(),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    await queryInterface.bulkInsert('Users',
      Array.from({ length: 5 }).map((d, i) => ({
        account: `@user${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: `user${i + 1}`,
        avatar: `https://loremflickr.com/320/240/people/?lock=${Math.ceil(Math.random() * 1000)}`,
        cover: `https://loremflickr.com/800/300/restaurant,food/?lock=${Math.ceil(Math.random() * 1000)}`,
        introduction: faker.lorem.sentences(),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      })), {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
