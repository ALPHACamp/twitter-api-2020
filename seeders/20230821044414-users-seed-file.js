'use strict'
const bcrypt = require('bcrypt')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 新增：依照DOD需求的兩個測試帳號
    const data = []
    const admin = {
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
    }
    data.push(admin)

    for (let i = 1; i <= 50; i++) {
      const user = {
        id: i + 1,
        email: `user${i}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        role: 'user',
        name: `User${i}`,
        account: `user${i}`,
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
      data.push(user)
    }

    await queryInterface.bulkInsert('Users', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
