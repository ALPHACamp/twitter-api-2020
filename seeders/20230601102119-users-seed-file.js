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
          introduction: faker.lorem.text().substring(0, 160),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user1',
          account: 'user1',
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          avatar: 'https://loremflickr.com/320/240/icon?lock=3',
          cover: `https://loremflickr.com/320/240/mountain/?random=${
            Math.random() * 100
          }`,
          role: 'user',
          introduction: faker.lorem.text().substring(0, 160),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user2',
          account: 'user2',
          email: 'user2@example.com',
          password: await bcrypt.hash('12345678', 10),
          avatar: 'https://loremflickr.com/320/240/icon?lock=20',
          cover: 'https://loremflickr.com/320/240/mountain?lock=20',
          role: 'user',
          introduction: faker.lorem.text().substring(0, 160),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user3',
          account: 'user3',
          email: 'user3@example.com',
          password: await bcrypt.hash('12345678', 10),
          avatar: 'https://loremflickr.com/320/240/icon?lock=1',
          cover: 'https://loremflickr.com/320/240/mountain?lock=1',
          role: 'user',
          introduction: faker.lorem.text().substring(0, 160),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user4',
          account: 'user4',
          email: 'user4@example.com',
          password: await bcrypt.hash('12345678', 10),
          avatar: 'https://loremflickr.com/320/240/icon?lock=11',
          cover: 'https://loremflickr.com/320/240/mountain?lock=11',
          role: 'user',
          introduction: faker.lorem.text().substring(0, 160),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user5',
          account: 'user5',
          email: 'user5@example.com',
          password: await bcrypt.hash('12345678', 10),
          avatar: 'https://loremflickr.com/320/240/avatar?lock=2',
          cover: 'https://loremflickr.com/320/240/mountain?lock=2',
          role: 'user',
          introduction: faker.lorem.text().substring(0, 160),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user6',
          account: 'user6',
          email: 'user6@example.com',
          password: await bcrypt.hash('12345678', 10),
          avatar: 'https://loremflickr.com/320/240/avatar?lock=15',
          cover: 'https://loremflickr.com/320/240/mountain?lock=15',
          role: 'user',
          introduction: faker.lorem.text().substring(0, 160),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user7',
          account: 'user7',
          email: 'user7@example.com',
          password: await bcrypt.hash('12345678', 10),
          avatar: 'https://loremflickr.com/320/240/avatar?lock=50',
          cover: 'https://loremflickr.com/320/240/mountain?lock=50',
          role: 'user',
          introduction: faker.lorem.text().substring(0, 160),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user8',
          account: 'user8',
          email: 'user8@example.com',
          password: await bcrypt.hash('12345678', 10),
          avatar: 'https://loremflickr.com/320/240/man?lock=21',
          cover: 'https://loremflickr.com/320/240/mountain?lock=21',
          role: 'user',
          introduction: faker.lorem.text().substring(0, 160),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user9',
          account: 'user9',
          email: 'user9@example.com',
          password: await bcrypt.hash('12345678', 10),
          avatar: 'https://loremflickr.com/320/240/man?lock=53',
          cover: 'https://loremflickr.com/320/240/mountain?lock=53',
          role: 'user',
          introduction: faker.lorem.text().substring(0, 160),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user10',
          account: 'user10',
          email: 'user10@example.com',
          password: await bcrypt.hash('12345678', 10),
          avatar: 'https://loremflickr.com/320/240/man?lock=80',
          cover: 'https://loremflickr.com/320/240/mountain?lock=80',
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
