'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      id: 1,
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      name: 'root',
      account: 'root',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'normal',
      name: 'user1',
      account: 'user1',
      avatar: `https://randomuser.me/api/portraits/men/${Math.ceil(Math.random() * 90)}.jpg`,
      cover: `https://loremflickr.com/960/640/landscape/?lock=${Math.ceil(Math.random() * 90)}`,
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 3,
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'normal',
      name: 'user2',
      account: 'user2',
      avatar: `https://randomuser.me/api/portraits/men/${Math.ceil(Math.random() * 90)}.jpg`,
      cover: `https://loremflickr.com/960/640/landscape/?lock=${Math.ceil(Math.random() * 90)}`,
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 4,
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'normal',
      name: 'user3',
      account: 'user3',
      avatar: `https://randomuser.me/api/portraits/women/${Math.ceil(Math.random() * 90)}.jpg`,
      cover: `https://loremflickr.com/960/640/landscape/?lock=${Math.ceil(Math.random() * 90)}`,
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 5,
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'normal',
      name: 'user4',
      account: 'user4',
      avatar: `https://randomuser.me/api/portraits/women/${Math.ceil(Math.random() * 90)}.jpg`,
      cover: `https://loremflickr.com/960/640/landscape/?lock=${Math.ceil(Math.random() * 90)}`,
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 6,
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'normal',
      name: 'user5',
      account: 'user5',
      avatar: `https://randomuser.me/api/portraits/women/${Math.ceil(Math.random() * 90)}.jpg`,
      cover: `https://loremflickr.com/960/640/landscape/?lock=${Math.ceil(Math.random() * 90)}`,
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
