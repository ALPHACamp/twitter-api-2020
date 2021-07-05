'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')
const functions = require('../config/functions')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      id: 1,
      email: 'ryan@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'Ryan',
      account: 'RyanHuang',
      introduction: faker.lorem.text().substring(0, 160),
      avatar: 'https://i.pravatar.cc/150?img=68',
      cover: `https://loremflickr.com/660/240/paris/?lock=${Math.random() * 100}`,
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
    }, {
      id: 2,
      email: 'lyvia@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'Lyvia',
      account: 'LyviaLee',
      introduction: faker.lorem.text().substring(0, 160),
      avatar: 'https://i.pravatar.cc/150?img=29',
      cover: `https://loremflickr.com/660/240/paris/?lock=${Math.random() * 100}`,
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
    }, {
      id: 3,
      email: 'aaron@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'Aaron',
      account: 'AaronWang',
      introduction: faker.lorem.text().substring(0, 160),
      avatar: 'https://i.pravatar.cc/150?img=56',
      cover: `https://loremflickr.com/660/240/paris/?lock=${Math.random() * 100}`,
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
    }, {
      id: 4,
      email: 'betrice@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'Beatrice',
      account: 'BeatricePai',
      introduction: faker.lorem.text().substring(0, 160),
      avatar: 'https://i.pravatar.cc/150?img=28',
      cover: `https://loremflickr.com/660/240/paris/?lock=${Math.random() * 100}`,
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
    }, {
      id: 5,
      email: 'tim@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'Tim',
      account: 'TimChien',
      introduction: faker.lorem.text().substring(0, 160),
      avatar: 'https://i.pravatar.cc/150?img=60',
      cover: `https://loremflickr.com/660/240/restaurant,food/?lock=${Math.random() * 100}`,
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
    }, {
      id: 6,
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'root',
      account: 'root',
      introduction: faker.lorem.text().substring(0, 160),
      role: 'admin',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
    },
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
