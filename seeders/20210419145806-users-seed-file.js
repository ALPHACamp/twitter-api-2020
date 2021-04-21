'use strict'
const bcrypt = require('bcryptjs')

module.exports = {

  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        account: 'root@example.com',
        name: 'Admin',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        introduction: 'My name is Admin',
        role: 'admin',
        avatar: `https://loremflickr.com/640/480/person?random=${Math.floor(Math.random() * 100)}&lock=${Math.floor(Math.random() * 1000)}`,
        cover: `https://loremflickr.com/640/480/nature?random=${Math.floor(Math.random() * 100)}&lock=${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      ...(Array.from({ length: 5 }).map((d, i) => (
        {
          id: i + 2,
          account: `user${i + 1}@example.com`,
          name: `User${i + 1}`,
          email: `user${i + 1}@example.com`,
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          introduction: `My name is user${i + 1}`,
          role: 'user',
          avatar: `https://loremflickr.com/640/480/person?random=${Math.floor(Math.random() * 100)}&lock=${Math.floor(Math.random() * 1000)}`,
          cover: `https://loremflickr.com/640/480/nature?random=${Math.floor(Math.random() * 100)}&lock=${Math.floor(Math.random() * 1000)}`,
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
