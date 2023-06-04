'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          // 一次新增三筆資料
          name: 'root',
          account: 'root',
          email: 'root@example.com',
          password: await bcrypt.hash('12345678', 10),
          avatar: `https://loremflickr.com/320/240/people/?random=${
            Math.random() * 10
          }`,
          cover: `https://loremflickr.com/320/240/mountain/?random=${
            Math.random() * 100
          }`,
          role: 'admin',
          introduction: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user1',
          account: 'user1',
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          avatar: `https://loremflickr.com/320/240/people/?random=${
            Math.random() * 10
          }`,
          cover: `https://loremflickr.com/320/240/mountain/?random=${
            Math.random() * 100
          }`,
          role: 'user',
          introduction: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user2',
          account: 'user2',
          email: 'user2@example.com',
          password: await bcrypt.hash('12345678', 10),
          avatar: `https://loremflickr.com/320/240/people/?random=${
            Math.random() * 10
          }`,
          cover: `https://loremflickr.com/320/240/mountain/?random=${
            Math.random() * 100
          }`,
          role: 'user',
          introduction: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user3',
          account: 'user3',
          email: 'user3@example.com',
          password: await bcrypt.hash('12345678', 10),
          avatar: `https://loremflickr.com/320/240/people/?random=${
            Math.random() * 10
          }`,
          cover: `https://loremflickr.com/320/240/mountain/?random=${
            Math.random() * 100
          }`,
          role: 'user',
          introduction: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user4',
          account: 'user4',
          email: 'user4@example.com',
          password: await bcrypt.hash('12345678', 10),
          avatar: `https://loremflickr.com/320/240/people/?random=${
            Math.random() * 10
          }`,
          cover: `https://loremflickr.com/320/240/mountain/?random=${
            Math.random() * 100
          }`,
          role: 'user',
          introduction: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user5',
          account: 'user5',
          email: 'user5@example.com',
          password: await bcrypt.hash('12345678', 10),
          avatar: `https://loremflickr.com/320/240/people/?random=${
            Math.random() * 10
          }`,
          cover: `https://loremflickr.com/320/240/mountain/?random=${
            Math.random() * 100
          }`,
          role: 'user',
          introduction: faker.lorem.text().substring(0, 160),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => { // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', {})
  }
}
