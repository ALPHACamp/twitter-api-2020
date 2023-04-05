'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'root',
          email: 'root@example.com',
          password: await bcrypt.hash('12345678', 10),
          account: 'root',
          role: 'admin',
          avatar: 'https://i.imgur.com/ZyXrPxB.png',
          cover: 'https://i.imgur.com/jXE6Mmp.png',
          introduction: faker.lorem.text().substring(0, 160),
          created_at: faker.date.between(
            '2019-01-01T00:00:00.000Z',
            '2019-02-01T00:00:00.000Z'
          ),
          updated_at: faker.date.between(
            '2019-03-01T00:00:00.000Z',
            '2019-04-01T00:00:00.000Z'
          )
        },
        {
          name: 'user1',
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          account: 'user1',
          role: 'user',
          avatar: 'https://i.imgur.com/ZyXrPxB.png',
          cover: 'https://i.imgur.com/jXE6Mmp.png',
          introduction: faker.lorem.text().substring(0, 160),
          created_at: faker.date.between(
            '2019-01-01T00:00:00.000Z',
            '2019-02-01T00:00:00.000Z'
          ),
          updated_at: faker.date.between(
            '2019-03-01T00:00:00.000Z',
            '2019-04-01T00:00:00.000Z'
          )
        },
        {
          name: 'user2',
          email: 'user2@example.com',
          password: await bcrypt.hash('12345678', 10),
          account: 'user2',
          role: 'user',
          avatar: 'https://i.imgur.com/ZyXrPxB.png',
          cover: 'https://i.imgur.com/jXE6Mmp.png',
          introduction: faker.lorem.text().substring(0, 160),
          created_at: faker.date.between(
            '2019-01-01T00:00:00.000Z',
            '2019-02-01T00:00:00.000Z'
          ),
          updated_at: faker.date.between(
            '2019-03-01T00:00:00.000Z',
            '2019-04-01T00:00:00.000Z'
          )
        },
        {
          name: 'user3',
          email: 'user3@example.com',
          password: await bcrypt.hash('12345678', 10),
          account: 'user3',
          role: 'user',
          avatar: 'https://i.imgur.com/ZyXrPxB.png',
          cover: 'https://i.imgur.com/jXE6Mmp.png',
          introduction: faker.lorem.text().substring(0, 160),
          created_at: faker.date.between(
            '2019-01-01T00:00:00.000Z',
            '2019-02-01T00:00:00.000Z'
          ),
          updated_at: faker.date.between(
            '2019-03-01T00:00:00.000Z',
            '2019-04-01T00:00:00.000Z'
          )
        },
        {
          name: 'user4',
          email: 'user4@example.com',
          password: await bcrypt.hash('12345678', 10),
          account: 'user4',
          role: 'user',
          avatar: 'https://i.imgur.com/ZyXrPxB.png',
          cover: 'https://i.imgur.com/jXE6Mmp.png',
          introduction: faker.lorem.text().substring(0, 160),
          created_at: faker.date.between(
            '2019-01-01T00:00:00.000Z',
            '2019-02-01T00:00:00.000Z'
          ),
          updated_at: faker.date.between(
            '2019-03-01T00:00:00.000Z',
            '2019-04-01T00:00:00.000Z'
          )
        },
        {
          name: 'user5',
          email: 'user5@example.com',
          password: await bcrypt.hash('12345678', 10),
          account: 'user5',
          role: 'user',
          avatar: 'https://i.imgur.com/ZyXrPxB.png',
          cover: 'https://i.imgur.com/jXE6Mmp.png',
          introduction: faker.lorem.text().substring(0, 160),
          created_at: faker.date.between(
            '2019-01-01T00:00:00.000Z',
            '2019-02-01T00:00:00.000Z'
          ),
          updated_at: faker.date.between(
            '2019-03-01T00:00:00.000Z',
            '2019-04-01T00:00:00.000Z'
          )
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
