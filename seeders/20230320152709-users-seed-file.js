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
            avatar: `https://picsum.photos/id/${Math.floor(
              Math.random() * 300
            )}/320/240`,
            introduction: faker.lorem.text().substring(0, 160),
            cover: `https://picsum.photos/id/${Math.floor(
              Math.random() * 300
            )}/639/200`,
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: 'user1',
            email: 'user1@example.com',
            password: await bcrypt.hash('12345678', 10),
            account: 'user1',
            avatar: `https://picsum.photos/id/${Math.floor(
              Math.random() * 300
            )}/320/240`,
            introduction: faker.lorem.text().substring(0, 160),
            cover: `https://picsum.photos/id/${Math.floor(
              Math.random() * 300
            )}/639/200`,
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        {}
      ),
      queryInterface.bulkInsert(
        'Users',
        Array.from({ length: 10 }, () => ({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: bcrypt.hashSync('12345678', 10),
          account: faker.name.findName(),
          avatar: `https://picsum.photos/id/${Math.floor(
            Math.random() * 300
          )}/320/240`,
          introduction: faker.lorem.text().substring(0, 160),
          cover: `https://picsum.photos/id/${Math.floor(
            Math.random() * 300
          )}/639/200`,
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
