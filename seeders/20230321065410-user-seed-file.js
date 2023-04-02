'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
const { loremFaker } = require('../helpers/faker-helpers')
const avatarId = [64, 65, 91, 129, 177, 319, 338, 342, 349, 373]
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('12345678', 10)
    let loremText = faker.lorem.sentences(5) // 5 sentences
    if (loremText.length > 150) {
      loremText = loremText.substring(0, 150)
    }
    await queryInterface.bulkInsert('Users', Array.from({ length: 20 }, (_, index) => ({
      email: `user${index}@example.com`,
      password: hashedPassword,
      role: 'user',
      name: `user${index}`,
      account: `user${index}`,
      introduction: loremFaker(100),
      created_at: new Date(),
      updated_at: new Date(),
      avatar: `https://picsum.photos/id/${avatarId[Math.floor(Math.random() * 10)]}/320/240`,
      cover: `https://picsum.photos/320/240?random=${Math.floor(Math.random() * 100)}`
    })))
    await queryInterface.bulkInsert('Users', [{ // 一次新增三筆資料
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'admin',
      name: 'root',
      account: 'root',
      introduction: faker.lorem.text(100),
      created_at: new Date(),
      updated_at: new Date(),
      avatar: `https://picsum.photos/id/${avatarId[Math.floor(Math.random() * 10)]}/320/240`,
      cover: `https://picsum.photos/320/240?random=${Math.floor(Math.random() * 100)}`

    }], {})
  },
  down: async (queryInterface, Sequelize) => { // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', {})
  }
}
