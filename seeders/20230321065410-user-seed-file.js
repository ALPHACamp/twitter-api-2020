'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('12345678', 10)
    await queryInterface.bulkInsert('Users', Array.from({ length: 20 }, (_, index) => ({
      email: `user${index}@example.com`,
      password: hashedPassword,
      role: 'user',
      name: `user${index}`,
      account: `user${index}`,
      created_at: new Date(),
      updated_at: new Date(),
      avatar: `https://loremflickr.com/320/240/people,casual/?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/320/240/scenary,city/?random=${Math.random() * 100}`
    })))
    await queryInterface.bulkInsert('Users', [{ // 一次新增三筆資料
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'admin',
      name: 'root',
      account: 'root',
      created_at: new Date(),
      updated_at: new Date(),
      avatar: `https://loremflickr.com/320/240/people,casual/?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/320/240/scenary,city/?random=${Math.random() * 100}`

    }], {})
  },
  down: async (queryInterface, Sequelize) => { // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', {})
  }
}
