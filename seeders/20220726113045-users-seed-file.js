'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // create 10 more seed users besides root and user1
    const users = []
    for (let i = 0; i < 10; i++) {
      users.push({
        account: `user${i + 2}`,
        email: `user${i + 2}@example.com`,
        password: bcrypt.hashSync('12345678', 10),
        name: faker.lorem.words(2),
        avatar: 'https://joeschmoe.io/api/v1/random',
        cover: 'https://github.com/ritachien/twitter-api-2022/blob/main/assets/default-cover.png?raw=true',
        introduction: faker.lorem.paragraphs().substring(0, 160),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    await queryInterface.bulkInsert('Users', [
      {
        account: 'root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', 10),
        name: 'root',
        avatar: 'https://joeschmoe.io/api/v1/random',
        cover: 'https://github.com/ritachien/twitter-api-2022/blob/main/assets/default-cover.png?raw=true',
        introduction: faker.lorem.paragraphs().substring(0, 160),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account: 'user1',
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', 10),
        name: 'user1',
        avatar: 'https://joeschmoe.io/api/v1/random',
        cover: 'https://github.com/ritachien/twitter-api-2022/blob/main/assets/default-cover.png?raw=true',
        introduction: faker.lorem.paragraphs().substring(0, 160),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      ...users
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {}, { truncate: true })
  }
}
