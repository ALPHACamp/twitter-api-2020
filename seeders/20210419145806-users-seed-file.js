'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {

  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        account: 'admin',
        name: 'Admin',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        introduction: 'My name is Admin',
        role: 'admin',
        avatar: faker.image.people(),
        cover: faker.image.nature(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      ...(Array.from({ length: 5 }).map((d, i) => (
        {
          id: i + 2,
          account: `user${i + 1}`,
          name: `User${i + 1}`,
          email: `user${i + 1}@example.com`,
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          introduction: `My name is user${i + 1}`,
          role: 'user',
          avatar: faker.image.people(),
          cover: faker.image.nature(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ))
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
