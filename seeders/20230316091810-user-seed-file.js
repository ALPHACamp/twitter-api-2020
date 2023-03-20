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
      avatar: faker.image.cats(360, 360, true),
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    })))

    await queryInterface.bulkInsert('Users', Array.from({ length: 11 }, (_, i) => {
      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      return {
        email: `${firstName.toLocaleLowerCase()}@email.com`,
        password: bcrypt.hashSync('12345678', 10),
        account: `${firstName} ${lastName}`,
        name: firstName,
        role: 'user',
        avatar: faker.image.cats(360, 360, true),
        cover: faker.image.animals(639, 378, true),
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
