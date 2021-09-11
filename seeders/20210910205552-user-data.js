'use strict';
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('11', bcrypt.genSaltSync(10), null),
      role: 'admin',
      name: 'root',
      avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      cover: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: bcrypt.hashSync('11', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user1',
      avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      cover: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: bcrypt.hashSync('11', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user2',
      avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      cover: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user3@example.com',
      password: bcrypt.hashSync('11', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user3',
      avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      cover: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      password: bcrypt.hashSync('11', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user4',
      avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      cover: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user5@example.com',
      password: bcrypt.hashSync('11', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user5',
      avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      cover: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}&lock=${Number(Math.random() * 100)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
