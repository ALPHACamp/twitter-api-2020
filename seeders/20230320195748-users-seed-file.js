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
          avatar: `https://loremflickr.com/320/240/man/?random=${
            Math.random() * 100
          }`,
          cover: `https://loremflickr.com/1440/480/city/?random=${
            Math.random() * 100
          }`,
          introduction: faker.lorem.text().substring(0, 160),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'user1',
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          account: 'user1',
          role: 'user',
          avatar: `https://loremflickr.com/320/240/woman/?random=${
            Math.random() * 100
          }`,
          cover: `https://loremflickr.com/1440/480/city/?random=${
            Math.random() * 100
          }`,
          introduction: faker.lorem.text().substring(0, 160),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'user2',
          email: 'user2@example.com',
          password: await bcrypt.hash('12345678', 10),
          account: 'user2',
          role: 'user',
          avatar: `https://loremflickr.com/320/240/woman/?random=${
            Math.random() * 100
          }`,
          cover: `https://loremflickr.com/1440/480/city/?random=${
            Math.random() * 100
          }`,
          introduction: faker.lorem.text().substring(0, 160),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'user3',
          email: 'user3@example.com',
          password: await bcrypt.hash('12345678', 10),
          account: 'user3',
          role: 'user',
          avatar: `https://loremflickr.com/320/240/woman/?random=${
            Math.random() * 100
          }`,
          cover: `https://loremflickr.com/1440/480/city/?random=${
            Math.random() * 100
          }`,
          introduction: faker.lorem.text().substring(0, 160),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'user4',
          email: 'user4@example.com',
          password: await bcrypt.hash('12345678', 10),
          account: 'user4',
          role: 'user',
          avatar: `https://loremflickr.com/320/240/woman/?random=${
            Math.random() * 100
          }`,
          cover: `https://loremflickr.com/1440/480/city/?random=${
            Math.random() * 100
          }`,
          introduction: faker.lorem.text().substring(0, 160),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'user5',
          email: 'user5@example.com',
          password: await bcrypt.hash('12345678', 10),
          account: 'user5',
          role: 'user',
          avatar: `https://loremflickr.com/320/240/woman/?random=${
            Math.random() * 100
          }`,
          cover: `https://loremflickr.com/1440/480/city/?random=${
            Math.random() * 100
          }`,
          introduction: faker.lorem.text().substring(0, 160),
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
