'use strict';
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      id: 99,
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      name: 'root',
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: `https://loremflickr.com/320/240/user/?lock=${Math.random() * 100}`
    }, {
      id: 1,
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: `https://loremflickr.com/320/240/user/?lock=${Math.random() * 100}`
    }, {
      id: 2,
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user2',
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: `https://loremflickr.com/320/240/user/?lock=${Math.random() * 100}`
    }, {
      id: 3,
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user3',
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: `https://loremflickr.com/320/240/user/?lock=${Math.random() * 100}`
    }, {
      id: 4,
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user4',
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: `https://loremflickr.com/320/240/user/?lock=${Math.random() * 100}`
    }, {
      id: 5,
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user5',
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: `https://loremflickr.com/320/240/user/?lock=${Math.random() * 100}`
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
