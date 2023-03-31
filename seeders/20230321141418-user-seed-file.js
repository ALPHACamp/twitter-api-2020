'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先產出所有user seed data後再調整
    const userSeedData = Array.from({ length: 20 }).map((item, index) => {
      return {
        email: faker.internet.email(),
        account: faker.internet.userName(),
        password: bcrypt.hashSync('12345678', 10),
        name: faker.internet.userName(),
        avatar: `https://picsum.photos/141/140?random=${index}`,
        cover_url: `https://picsum.photos/639/200?random=${index}`,
        introduction: faker.lorem.paragraph(),
        role: 'user',
        created_at: faker.date.past(),
        updated_at: faker.date.recent()
      }
    })

    // 設定admin
    userSeedData[0].role = 'admin'
    userSeedData[0].account = 'root'
    userSeedData[0].email = 'root@example.com'
    // 設定user1
    userSeedData[1].account = 'user1'
    userSeedData[1].email = 'user1@example.com'

    await queryInterface.bulkInsert('Users', userSeedData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
