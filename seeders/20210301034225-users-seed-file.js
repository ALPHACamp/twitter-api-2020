'use strict'
const faker = require('faker')
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 建立使用者
    const users = Array.from({ length: 10 }).map((d, i) =>
    ({
      id: i ,
      name: faker.name.findName(),
      account: `user${i}`,
      email: `user${i}@example.com`,
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      avatar: `https://loremflickr.com/320/240/dog/?lock=${Math.random() * 50}`,
      cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 50}`,
      introduction: faker.lorem.text(),
      role: '測試',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    )
    // 建立管理者
    const admin = [{
      name: 'root',
      account: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      isAdmin: true,
      avatar: `https://loremflickr.com/320/240/dog/?lock=${Math.random() * 50}`,
      cover: `https://loremflickr.com/320/240/landscape/?lock=${Math.random() * 50}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }]
    // 將兩筆陣列相接
    const startSeeders = users.concat(admin)
    // 開始建立資料
    await queryInterface.bulkInsert('Users', startSeeders)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
