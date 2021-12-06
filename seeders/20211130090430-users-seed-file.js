'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      Array.from({ length: 10 }).map((d, i) => ({
        id: i + 1,
        email: `user${i + 1}@example.com`,
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: faker.name.findName().split(' ')[1],
        account: `user${i + 1}`,
        avatar: `https://randomuser.me/api/portraits/women/${Math.ceil(Math.random() * 100)}.jpg`,
        cover: `https://loremflickr.com/320/240/city/?random=${Math.ceil(Math.random() * 100)}`,
        introduction: faker.lorem.text(),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: 11,
          email: 'root@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'root',
          account: 'root',
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
