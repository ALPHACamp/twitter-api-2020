'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('12345678', 10)
    // 先產出所有user seed data後再調整
    let userSeedData = Array.from({ length: 20 }).map(item => {
      return {
        email: faker.internet.email(),
        account: faker.internet.userName(),
        password: hashedPassword,
        name: faker.internet.userName(),
        avatar: 'https://raw.githubusercontent.com/LJBL22/react_twitter/3d808b59166970aa7c34cbb78dba58d70b11fc63/src/logo.svg',
        cover_url: 'https://github.com/LJBL22/react_twitter/blob/main/src/assets/images/defaultCover.jpg?raw=true',
        introduction: faker.lorem.paragraph(),
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    // 設定admin
    userSeedData[0].role = 'admin'
    userSeedData[0].account = 'root'
    userSeedData[0].email = 'root@example.com'
    // 設定user1
    userSeedData[1].account = 'user1'
    userSeedData[1].email = 'user1@example.com'

    await queryInterface.bulkInsert('users', userSeedData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
