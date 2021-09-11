'use strict'

const faker = require('faker')
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: 5,
          email: 'root@example.com',
          account: 'root',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
          name: 'root',
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 15,
          email: 'user1@example.com',
          account: 'user1',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
          name: 'User1',
          avatar: `https://loremflickr.com/320/240/boy/?lock=${Math.random() * 100}`,
          introduction: faker.lorem.sentence(3),
          cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 100}`,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 25,
          email: 'user2@example.com',
          account: 'user2',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
          name: 'User2',
          avatar: `https://loremflickr.com/320/240/boy/?lock=${Math.random() * 100}`,
          introduction: faker.lorem.sentence(3),
          cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 100}`,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 35,
          email: 'user3@example.com',
          account: 'user3',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
          name: 'User3',
          avatar: `https://loremflickr.com/320/240/girl/?lock=${Math.random() * 100}`,
          introduction: faker.lorem.sentence(3),
          cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 100}`,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 45,
          email: 'user4@example.com',
          account: 'user4',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
          name: 'User4',
          avatar: `https://loremflickr.com/320/240/boy/?lock=${Math.random() * 100}`,
          introduction: faker.lorem.sentence(3),
          cover: `https://loremflickr.com/320/240/landscape/?lock=${
            Math.random() * 100
          }`,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 55,
          email: 'user5@example.com',
          account: 'user5',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
          name: 'User5',
          avatar: `https://loremflickr.com/320/240/girl/?lock=${Math.random() * 100}`,
          introduction: faker.lorem.sentence(3),
          cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 100}`,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, { truncate: true })
  }
}
