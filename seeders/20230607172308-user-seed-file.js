'use strict'
const bcrypt = require('bcryptjs')
const banner = 'https://i.imgur.com/jsrSDDm.png'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'admin',
      name: 'root',
      account: 'root',
      avatar: 'http://randomuser.me/api/portraits/women/3.jpg',
      banner: banner,
      introduction: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user1',
      account: 'user1',
      avatar: 'http://randomuser.me/api/portraits/women/4.jpg',
      banner: banner,
      introduction: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user2',
      account: 'user2',
      avatar: 'http://randomuser.me/api/portraits/women/5.jpg',
      banner: banner,
      introduction: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user3',
      account: 'user3',
      avatar: 'http://randomuser.me/api/portraits/women/6.jpg',
      banner: banner,
      introduction: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user4',
      account: 'user4',
      avatar: 'http://randomuser.me/api/portraits/women/7.jpg',
      banner: banner,
      introduction: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user5',
      account: 'user5',
      avatar: 'http://randomuser.me/api/portraits/women/8.jpg',
      banner: banner,
      introduction: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user6@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user6',
      account: 'user6',
      avatar: 'http://randomuser.me/api/portraits/women/9.jpg',
      banner: banner,
      introduction: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user7@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user7',
      account: 'user7',
      avatar: 'http://randomuser.me/api/portraits/women/10.jpg',
      banner: banner,
      introduction: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user8@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user8',
      account: 'user8',
      avatar: 'http://randomuser.me/api/portraits/women/11.jpg',
      banner: banner,
      introduction: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user9@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user9',
      account: 'user9',
      avatar: 'http://randomuser.me/api/portraits/women/12.jpg',
      banner: banner,
      introduction: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
