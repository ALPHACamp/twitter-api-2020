'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DEFAULT_PASSWORD = '12345678'
    const userSeeder = []
    userSeeder.push({
      name: 'root',
      account: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync(DEFAULT_PASSWORD, 10),
      avatar: `https://loremflickr.com/240/240?lock=${(Math.random() * 100) + 1}`,
      cover: `https://loremflickr.com/480/360?lock=${(Math.random() * 100) + 1}`,
      role: 'admin',
      introduction: faker.lorem.text().substring(0, 160),
      tweetCount: 0,
      likeCount: 0,
      followerCount: 0,
      followingCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    const normalUsers = Array.from({ length: 5 }, (_, index) => {
      return {
        name: `user${index + 1}`,
        account: `user${index + 1}`,
        email: `user${index + 1}@example.com`,
        password: bcrypt.hashSync(DEFAULT_PASSWORD, 10),
        avatar: `https://loremflickr.com/240/240?lock=${(Math.random() * 100) + 1}`,
        cover: `https://loremflickr.com/480/360?lock=${(Math.random() * 100) + 1}`,
        role: 'user',
        introduction: faker.lorem.text().substring(0, 160),
        tweetCount: 0,
        likeCount: 0,
        followerCount: 0,
        followingCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    userSeeder.push(...normalUsers)
    await queryInterface.bulkInsert('Users', userSeeder)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null)
  }
}
