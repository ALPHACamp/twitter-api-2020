'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
// Admin （必須包括登入帳號 account: root, email: root @example.com, password: 12345678）
// 至少提供 5 個一般使用者（其中必須包括登入帳號 account: user1, email: user1 @example.com, password: 12345678）
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{ // 一次新增三筆資料
      account: 'root',
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      introduction: faker.lorem.text(),
      avatar: 'https://loremflickr.com/320/240/portrait/?lock=18',
      cover_image: 'https://loremflickr.com/g/1079/359/moutain',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user1',
      name: 'user1name',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      introduction: faker.lorem.text(),
      avatar: 'https://imgur.com/buZlxFF.jpeg',
      cover_image: 'https://imgur.com/Uongp79.jpg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user2',
      name: 'user2name',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      introduction: faker.lorem.text(),
      avatar: 'https://imgur.com/Nnf5Vc6.jpeg',
      cover_image: 'https://imgur.com/8adzIYk.jpeg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user3',
      name: 'user3name',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      introduction: faker.lorem.text(),
      avatar: 'https://imgur.com/jt2Gsoe.jpeg',
      cover_image: 'https://i.imgur.com/xLEsB6E.jpg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user4',
      name: 'user4name',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      introduction: faker.lorem.text(),
      avatar: 'https://imgur.com/w0BeCel.jpeg',
      cover_image: 'https://imgur.com/XJFpoUa.jpeg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user5',
      name: 'user5name',
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      introduction: faker.lorem.text(),
      avatar: 'https://imgur.com/8R1V7JG.jpeg',
      cover_image: 'https://i.imgur.com/OrLvI90.jpg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
