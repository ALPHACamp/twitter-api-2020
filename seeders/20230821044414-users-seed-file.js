'use strict'
const bcrypt = require('bcrypt')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 新增：依照DOD需求的兩個測試帳號
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: 1,
          email: 'root@example.com',
          password: await bcrypt.hash('12345678', 10),
          role: 'admin',
          name: 'Admin',
          account: 'root',
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
          id: 2,
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          role: 'user',
          name: 'User1',
          account: 'user1',
          avatar: `https://loremflickr.com/320/240/man/?random=${
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
