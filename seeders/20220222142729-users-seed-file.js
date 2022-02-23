'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // create 6 users, only root user is admin
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      password: await bcrypt.hash('12345678', 10),
      name: 'root',
      email: 'root@example.com',
      avatar: 'https://loremflickr.com/140/140/people?random=100',
      introduction: faker.lorem.text().substring(0, 100),
      role: 'admin',
      cover: 'https://loremflickr.com/600/200/nature?random=100',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: 'user1',
      password: await bcrypt.hash('12345678', 10),
      name: 'user1',
      email: 'user1@example.com',
      avatar: 'https://loremflickr.com/140/140/people?random=100',
      introduction: faker.lorem.text().substring(0, 100),
      role: '',
      cover: 'https://loremflickr.com/600/200/nature?random=100',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: 'user2',
      password: await bcrypt.hash('12345678', 10),
      name: 'user2',
      email: 'user2@example.com',
      avatar: 'https://loremflickr.com/140/140/people?random=100',
      introduction: faker.lorem.text().substring(0, 100),
      role: '',
      cover: 'https://loremflickr.com/600/200/nature?random=100',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: 'user3',
      password: await bcrypt.hash('12345678', 10),
      name: 'user3',
      email: 'user3@example.com',
      avatar: 'https://loremflickr.com/140/140/people?random=100',
      introduction: faker.lorem.text().substring(0, 100),
      role: '',
      cover: 'https://loremflickr.com/600/200/nature?random=100',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: 'user4',
      password: await bcrypt.hash('12345678', 10),
      name: 'user4',
      email: 'user4@example.com',
      avatar: 'https://loremflickr.com/140/140/people?random=100',
      introduction: faker.lorem.text().substring(0, 100),
      role: '',
      cover: 'https://loremflickr.com/600/200/nature?random=100',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: 'user5',
      password: await bcrypt.hash('12345678', 10),
      name: 'user5',
      email: 'user5@example.com',
      avatar: 'https://loremflickr.com/140/140/people?random=100',
      introduction: faker.lorem.text().substring(0, 100),
      role: '',
      cover: 'https://loremflickr.com/600/200/nature?random=100',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};