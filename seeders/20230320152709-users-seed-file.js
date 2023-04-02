'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'Users',
        [
          {
            name: 'root',
            email: 'root@example.com',
            password: await bcrypt.hash('12345678', 10),
            account: 'root',
            avatar: 'https://source.unsplash.com/random/320×240/?people',
            introduction: faker.lorem.text().substring(0, 160),
            cover: 'https://source.unsplash.com/random/639×200/?nature',
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: 'user1',
            email: 'user1@example.com',
            password: await bcrypt.hash('12345678', 10),
            account: 'user1',
            avatar: 'https://source.unsplash.com/random/320×240/?people',
            introduction: faker.lorem.text(),
            cover: 'https://source.unsplash.com/random/639×200/?nature',
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        {}
      ),
      queryInterface.bulkInsert(
        'Users',
        Array.from({ length: 4 }, () => ({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: bcrypt.hashSync('12345678', 10),
          account: faker.name.findName(),
          avatar: 'https://source.unsplash.com/random/320×240/?people',
          introduction: faker.lorem.text().substring(0, 160),
          cover: 'https://source.unsplash.com/random/639×200/?nature',
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        {}
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, { truncate: true })
  }
}
