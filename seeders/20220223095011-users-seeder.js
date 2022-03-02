'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker')
const { randomTime } = require('../helpers/random-time-generator')
const {
  DEFAULT_PASSWORD,
  BCRYPT_COMPLEXITY,
  DEFAULT_USER_NUMBER
} = require('../config/seeder')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */


    const seederArray = []

    // add an admin
    seederArray.push({
      name: `root`,
      account: `root`,
      email: `root@example.com`,
      password: bcrypt.hashSync(DEFAULT_PASSWORD, BCRYPT_COMPLEXITY),
      avatar: `https://loremflickr.com/240/240?lock=${(Math.random() * 100) + 1}`,
      cover: `https://loremflickr.com/720/240?lock=${(Math.random() * 100) + 1}`,
      role: "admin",
      introduction: faker.lorem.text().substring(0, 160),
      tweetCount: 0,
      likeCount: 0,
      followerCount: 0,
      followingCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // add a set of users

    const userArray = Array.from({ length: DEFAULT_USER_NUMBER }, (_, index) => {
      return {
        name: `user${index + 1}`,
        account: `user${index + 1}`,
        email: `user${index + 1}@example.com`,
        password: bcrypt.hashSync(DEFAULT_PASSWORD, BCRYPT_COMPLEXITY),
        avatar: `https://loremflickr.com/240/240?lock=${(Math.random() * 100) + 1}`,
        cover: `https://loremflickr.com/720/240?lock=${(Math.random() * 100) + 1}`,
        role: "user",
        introduction: faker.lorem.text().substring(0, 160),
        tweetCount: 0,
        likeCount: 0,
        followerCount: 0,
        followingCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    seederArray.push(...userArray)


    await queryInterface.bulkInsert('Users', seederArray)
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('Users', null)
  }
}
