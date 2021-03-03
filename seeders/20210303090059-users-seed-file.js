'use strict';

const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      id: 1,
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      name: 'root',
      avatar: 'https://i.imgur.com/eNQO9Ra.png',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 11,
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: null,
      name: 'user1',
      avatar: 'https://i.imgur.com/eNQO9Ra.png',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 21,
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: null,
      name: 'user2',
      avatar: 'https://i.imgur.com/eNQO9Ra.png',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
