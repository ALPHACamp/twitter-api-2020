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
      introduction: faker.lorem.text(),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: '@user1',
      email: "user1@example.com",
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user1',
      avatar: `https://loremflickr.com/320/240/people/?lock=${Math.ceil(Math.random() * 1000)}`,
      cover: `https://loremflickr.com/800/300/restaurant,food/?lock=${Math.ceil(Math.random() * 1000)}`,
      introduction: faker.lorem.text(),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: '@user2',
      email: "user2@example.com",
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user2',
      avatar: `https://loremflickr.com/320/240/people/?lock=${Math.ceil(Math.random() * 1000)}`,
      cover: `https://loremflickr.com/800/300/restaurant,food/?lock=${Math.ceil(Math.random() * 1000)}`,
      introduction: faker.lorem.text(),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: '@user3',
      email: "user3@example.com",
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user3',
      avatar: `https://loremflickr.com/320/240/people/?lock=${Math.ceil(Math.random() * 1000)}`,
      cover: `https://loremflickr.com/800/300/restaurant,food/?lock=${Math.ceil(Math.random() * 1000)}`,
      introduction: faker.lorem.text(),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: '@user4',
      email: "user4@example.com",
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user4',
      avatar: `https://loremflickr.com/320/240/people/?lock=${Math.ceil(Math.random() * 1000)}`,
      cover: `https://loremflickr.com/800/300/restaurant,food/?lock=${Math.ceil(Math.random() * 1000)}`,
      introduction: faker.lorem.text(),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: '@user5',
      email: "user5@example.com",
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'user5',
      avatar: `https://loremflickr.com/320/240/people/?lock=${Math.ceil(Math.random() * 1000)}`,
      cover: `https://loremflickr.com/800/300/restaurant,food/?lock=${Math.ceil(Math.random() * 1000)}`,
      introduction: faker.lorem.text(),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ])
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
