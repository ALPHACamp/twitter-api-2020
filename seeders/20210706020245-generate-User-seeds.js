'use strict'
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = Array.from({ length: 6 }).map((user, i) => {
      const person = {
        id: i + 1,
        account: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: faker.name.findName(),
        role: 'user',
        avatar: 'https://loremflickr.com/g/320/240/girl/all',
        cover: 'https://loremflickr.com/800/600/dog',
        introduction: faker.lorem.text(100),
        createdAt: new Date(),
        updatedAt: new Date(),
        likeNum: 0,
        tweetNum: 10,
        followingNum: 0,
        followerNum: 0,
        lastLoginAt: new Date()
      }
      if (i === 5) {
        person.account = 'root'
        person.email = 'root@example.com'
        person.role = 'admin'
      }
      return person
    })
    await queryInterface.bulkInsert('Users', data, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
