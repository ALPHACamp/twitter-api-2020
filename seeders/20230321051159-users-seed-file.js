'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      name: 'admin',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      introduction: 'I am admin',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user1',
      name: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      introduction: 'I am user1',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user2',
      name: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      introduction: 'I am user2',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user3',
      name: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      introduction: 'I am user3',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user4',
      name: 'user4',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      introduction: 'I am user4',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user5',
      name: 'user5',
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      introduction: 'I am user5',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => { // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', {})
  }
}
