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
    },
    ...Array.from({ length: 20 }, (_, i) => ({
      account: `user${i + 1}`,
      name: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: bcrypt.hashSync('12345678', 10),
      introduction: `I am user${i + 1}`,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }))])
  },
  down: async (queryInterface, Sequelize) => { // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', {})
  }
}
