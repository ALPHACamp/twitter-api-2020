'use strict';
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      account: 'root',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'user1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      account: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      cover: 'https://images.unsplash.com/photo-1631291944493-9fc60898569c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=667&q=80'
    }, {
      name: 'user2',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      account: 'user2',
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      cover: 'https://images.unsplash.com/photo-1631116618069-041bbcaf2e3c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80'
    }, {
      name: 'user3',
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      account: 'user3',
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      cover: 'https://images.unsplash.com/photo-1631119461477-8865032b7520?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=626&q=80'
    }, {
      name: 'user4',
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      account: 'user4',
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      cover: 'https://images.unsplash.com/photo-1631116617822-e100bd7e6e06?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80'
    },], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
