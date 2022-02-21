'use strict'
const faker = require('faker')
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      account: 'root',
      password: await bcrypt.hash('12345678', 10),
      isAdmin: true,
      name: 'root',
      introduction:  faker.lorem.text(),
      cover: `https://loremflickr.com/320/240/monster/?random=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/320/240/monster/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email: 'user1@example.com',
      account: 'user1',
      password: await bcrypt.hash('12345678', 10),
      isAdmin: false,
      name: 'user1',
      introduction:  faker.lorem.text(),
      cover: `https://loremflickr.com/320/240/monster/?random=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/320/240/monster/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email: 'user2@example.com',
      account: 'user2',
      password: await bcrypt.hash('12345678', 10),
      isAdmin: false,
      name: 'user2',
      introduction:  faker.lorem.text(),
      cover: `https://loremflickr.com/320/240/monster/?random=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/320/240/monster/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email: 'aaa@aaa.aaa',
      account: 'aaa',
      password: await bcrypt.hash('12345678', 10),
      isAdmin: false,
      name: 'aaa',
      introduction:  faker.lorem.text(),
      cover: `https://loremflickr.com/320/240/monster/?random=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/320/240/monster/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email: 'bbb@bbb.bbb',
      account: 'bbb',
      password: await bcrypt.hash('12345678', 10),
      isAdmin: false,
      name: 'bbb',
      introduction:  faker.lorem.text(),
      cover: `https://loremflickr.com/320/240/monster/?random=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/320/240/monster/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email: 'ccc@ccc.ccc',
      account: 'ccc',
      password: await bcrypt.hash('12345678', 10),
      isAdmin: false,
      name: 'ccc',
      introduction:  faker.lorem.text(),
      cover: `https://loremflickr.com/320/240/monster/?random=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/320/240/monster/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
