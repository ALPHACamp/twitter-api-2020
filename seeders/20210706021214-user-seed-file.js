'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const admin = {
      id: 1,
      account: 'root@example.com',
      name: 'Admin',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      introduction: faker.lorem.sentence(),
      avatar: 'https://loremflickr.com/320/240/people?random=100',
      cover: 'https://loremflickr.com/320/240/view?random=100',
      followingCount: 0,
      followerCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const users = Array.from({ length: 5 }).map((item, i) => ({
      id: i + 2,
      account: `user${i + 2}`,
      name: `user${i + 2}`,
      email: faker.internet.email(),
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      introduction: faker.lorem.sentence(),
      avatar: `https://loremflickr.com/320/240/people?random=${i}`,
      cover: `https://loremflickr.com/320/240/view?random=${i}`,
      followingCount: 0,
      followerCount:0,
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    users.push(admin)

    await queryInterface.bulkInsert('Users', users, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
};
