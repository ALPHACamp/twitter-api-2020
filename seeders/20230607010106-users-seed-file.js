'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
const userCount = 5 // default user

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await Promise.all([
      queryInterface.bulkInsert(
        'Users', // admin
        [
          {
            name: 'root',
            account: 'root',
            email: 'root@example.com',
            password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
            avatar: `https://loremflickr.com/140/140/food/?lock=${Math.random() * 100}`,
            cover: `https://loremflickr.com/640/200/mountain/?lock=${Math.random() * 100}`,
            introduction: faker.lorem.text().substring(0, 50),
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        {}
      ),
      queryInterface.bulkInsert(
        'Users',
        Array.from({ length: userCount }, (_, i) => ({
          name: faker.name.findName(),
          account: `user${i}`,
          email: `user${i}@example.com`,
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          avatar: `https://loremflickr.com/140/140/food/?lock=${Math.random() * 100}`,
          cover: `https://loremflickr.com/640/200/mountain/?lock=${Math.random() * 100}`,
          introduction: faker.lorem.text().substring(0, 50),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        {}
      )
    ])
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}
