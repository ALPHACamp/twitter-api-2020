'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
const userCounts = 5 // default user

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await Promise.all([
      queryInterface.bulkInsert(
        'Users', //admin
        [
          {
            name: 'root',
            account: 'root',
            email: 'root@example.com',
            password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
            avatar: 'https://i.imgur.com/TmLy5dw.png',
            cover: 'https://i.imgur.com/pNr8Hlb.jpeg',
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
        Array.from({ length: userCounts }, (_, i) => ({
          name: faker.name.findName(),
          account: `user${i}`,
          email: `user${i}@example.com`,
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          avatar: 'https://i.imgur.com/TmLy5dw.png',
          cover: 'https://i.imgur.com/pNr8Hlb.jpeg',
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
