'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
const { randomDate } = require('../_helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userNameList = ['Allen', 'Benjamin', 'Chris', 'Drake', 'Edward']
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: 1,
          account: 'root',
          email: 'root@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'Administrator',
          avatar: `https://i.pravatar.cc/150?u=${
            (Math.floor(Math.random() * 10) + 10) * 100
          }`,
          cover: `https://loremflickr.com/600/240/landscape/?random=${
            Math.random() * 100
          }`,
          introduction: faker.lorem.sentence().substring(0, 160),
          role: 'admin',
          createdAt: new Date(2021, 10, 20),
          updatedAt: new Date()
        }
      ],
      {}
    )
    await queryInterface.bulkInsert(
      'users',
      ['user1', 'user2', 'user3', 'user4', 'user5'].map((user, index) => ({
        id: (index + 1) * 10 + 1,
        account: user,
        email: `${user}@example.com`,
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: `${userNameList[index]}`,
        avatar: `https://i.pravatar.cc/150?u=${
          Math.ceil(Math.random() * 100) * index
        }`,
        cover: `https://loremflickr.com/600/240/landscape/?random=${
          Math.random() * 100
        }`,
        introduction: faker.lorem.sentence().substring(0, 160),
        role: 'user',
        createdAt: new Date(2021, 10, index + 21),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
