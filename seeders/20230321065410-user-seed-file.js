'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
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

    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      account: 'user1',
      name: 'user1',
      created_at: new Date(),
      updated_at: new Date(),
      avatar: `https://loremflickr.com/320/240/people,casual/?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/320/240/scenary,city/?random=${Math.random() * 100}`
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user2',
      account: 'user2',
      created_at: new Date(),
      updated_at: new Date(),
      avatar: `https://loremflickr.com/320/240/people,casual/?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/320/240/scenary,city/?random=${Math.random() * 100}`
    }, {
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user3',
      account: 'user3',
      created_at: new Date(),
      updated_at: new Date(),
      avatar: `https://loremflickr.com/320/240/people,casual/?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/320/240/scenary,city/?random=${Math.random() * 100}`
    }, {
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user4',
      account: 'user4',
      created_at: new Date(),
      updated_at: new Date(),
      avatar: `https://loremflickr.com/320/240/people,casual/?random=${Math.random() * 100}`,
      cover: `https://loremflickr.com/320/240/scenary,city/?random=${Math.random() * 100}`
    }, {
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user5',
      account: 'user5',
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
