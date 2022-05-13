'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          // 新增Admin資料
          account: 'root',
          name: 'root',
          email: 'root@example.com',
          password: await bcrypt.hash('12345678', 10),
          role: 'admin',
          avatar: 'https://i.imgur.com/q6bwDGO.png',
          cover: 'https://source.unsplash.com/1000x200/?nature',
          introduction: faker.lorem.text().substring(0, 50),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          // 新增五筆使用者種子資料
          account: 'user1',
          name: 'user1',
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          role: '',
          avatar: 'https://i.imgur.com/q6bwDGO.png',
          cover: 'https://source.unsplash.com/1000x200/?nature',
          introduction: faker.lorem.text().substring(0, 50),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          account: 'user2',
          name: 'user2',
          email: 'user2@example.com',
          password: await bcrypt.hash('12345678', 10),
          role: '',
          avatar: 'https://i.imgur.com/q6bwDGO.png',
          cover: 'https://source.unsplash.com/1000x200/?nature',
          introduction: faker.lorem.text().substring(0, 50),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          account: 'user3',
          name: 'user3',
          email: 'user3@example.com',
          password: await bcrypt.hash('12345678', 10),
          role: '',
          avatar: 'https://i.imgur.com/q6bwDGO.png',
          cover: 'https://source.unsplash.com/1000x200/?nature',
          introduction: faker.lorem.text().substring(0, 50),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          account: 'user4',
          name: 'user4',
          email: 'user4@example.com',
          password: await bcrypt.hash('12345678', 10),
          role: '',
          avatar: 'https://i.imgur.com/q6bwDGO.png',
          cover: 'https://source.unsplash.com/1000x200/?nature',
          introduction: faker.lorem.text().substring(0, 50),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          account: 'user5',
          name: 'user5',
          email: 'user5@example.com',
          password: await bcrypt.hash('12345678', 10),
          role: '',
          avatar: 'https://i.imgur.com/q6bwDGO.png',
          cover: 'https://source.unsplash.com/1000x200/?nature',
          introduction: faker.lorem.text().substring(0, 50),
          created_at: new Date(),
          updated_at: new Date()
        },
      ],
      {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', null, {})
  },
}
