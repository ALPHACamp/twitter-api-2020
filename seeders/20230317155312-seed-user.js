'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      email: 'root@example.com',
      password: await bcrypt.hashSync('12345678'),
      name: 'root',
      avatar: 'https://loremflickr.com/320/240/',
      introduction: faker.lorem.sentence(5),
      role: 'admin',
      background: 'https://loremflickr.com/320/240/',
      created_at: new Date(),
      updated_at: new Date()
    },
    ...Array.from({ length: 5 }, (_, index) => {
      return {
        account: `user${index + 1}`,
        email: `user${index + 1}@example.com`,
        password: bcrypt.hashSync('12345678'),
        name: `user${index + 1}`,
        avatar: `https://loremflickr.com/320/240?lock=${index}`,
        introduction: faker.lorem.sentence(5),
        role: 'user',
        background: 'https://loremflickr.com/320/240/',
        created_at: new Date(),
        updated_at: new Date()
      }
    })], {})
  },
  down: async (queryInterface, Sequelize) => { // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', {})
  }
}
