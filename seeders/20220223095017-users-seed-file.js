'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: 'root',
        introduction: faker.lorem.text().substring(0, 160),
        avatar: 'https://loremflickr.com/320/320/people?random=${Math.random() * 100}',
        cover: 'https://loremflickr.com/800/600/paris?random=${Math.random() * 100}',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        tweetCount: 10,
        followingCount: 0,
        followerCount: 0,
        likedCount: 0
      },
      ...Array.from({ length: 10 }, (_, i) => ({
        name: faker.name.findName(),
        email: `user${ i + 1 }@example.com`,
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        account: `user${ i + 1 }`,
        introduction: faker.lorem.text().substring(0, 160),
        avatar: 'https://loremflickr.com/320/320/people?random=${Math.random() * 100}',
        cover: 'https://loremflickr.com/800/600/paris?random=${Math.random() * 100}',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        tweetCount: 10,
        followingCount: 0,
        followerCount: 0,
        likedCount: 0
      }))
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}