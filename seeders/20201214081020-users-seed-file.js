'use strict';
const bcrypt = require('bcrypt-nodejs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        account: '@root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'root',
        avatar: 'https://developers.google.com/web/tools/chrome-user-experience-report/images/logo.png',
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        account: '@user1',
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user1',
        avatar: `https://loremflickr.com/320/240/restaurant,food/?lock=${Math.random() * 100}`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        account: '@user2',
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user2',
        avatar: `https://loremflickr.com/320/240/restaurant,food/?lock=${Math.random() * 100}`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        account: '@user3',
        email: 'user3@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user3',
        avatar: `https://loremflickr.com/320/240/restaurant,food/?lock=${Math.random() * 100}`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        account: '@user4',
        email: 'user4@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user4',
        avatar: `https://loremflickr.com/320/240/restaurant,food/?lock=${Math.random() * 100}`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        account: '@user5',
        email: 'user5@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user5',
        avatar: `https://loremflickr.com/320/240/restaurant,food/?lock=${Math.random() * 100}`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        account: '@user6',
        email: 'user6@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user6',
        avatar: `https://loremflickr.com/320/240/restaurant,food/?lock=${Math.random() * 100}`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        account: '@user7',
        email: 'user7@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user7',
        avatar: `https://loremflickr.com/320/240/restaurant,food/?lock=${Math.random() * 100}`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        account: '@user8',
        email: 'user8@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user8',
        avatar: `https://loremflickr.com/320/240/restaurant,food/?lock=${Math.random() * 100}`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        account: '@user9',
        email: 'user9@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user9',
        avatar: `https://loremflickr.com/320/240/restaurant,food/?lock=${Math.random() * 100}`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 11,
        account: '@user10',
        email: 'user10@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user10',
        avatar: `https://loremflickr.com/320/240/restaurant,food/?lock=${Math.random() * 100}`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
