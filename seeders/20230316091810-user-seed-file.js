'use strict'
const { faker } = require('@faker-js/faker')
const bcrypt = require('bcryptjs')

const users = [
  {
    email: 'root@example.com',
    password: '12345678',
    name: 'root',
    account: 'root',
    role: 'admin'
  },
  {
    email: 'user1@example.com',
    password: '12345678',
    name: 'user1',
    account: 'user1',
    role: 'user'
  }
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', users.map(user => ({
      email: user.email,
      password: bcrypt.hashSync(user.password, 10),
      name: user.name,
      account: user.account,
      role: user.role,
      avatar: `https://picsum.photos/seed/${Math.floor(Math.random() * 999)}/300/300`,
      cover: 'https://i.imgur.com/vzIPCvD.png',
      introduction: faker.lorem.words(5),
      createdAt: new Date(),
      updatedAt: new Date()
    })))

    await queryInterface.bulkInsert('Users', Array.from({ length: 11 }, (_, i) => {
      const name = faker.name.firstName()
      const account = name.toLowerCase()
      const randomNums = Math.floor(Math.random() * 99) + 1
      return {
        email: `${account}@email.com`,
        password: bcrypt.hashSync('12345678', 10),
        account: `${account}${randomNums}`,
        name,
        role: 'user',
        avatar: `https://picsum.photos/seed/${Math.floor(Math.random() * 999)}/300/300`,
        cover: `https://picsum.photos/seed/${Math.floor(Math.random() * 999)}/639/380`,
        introduction: faker.lorem.words(5),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
