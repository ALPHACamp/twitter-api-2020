'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [adminData] = await queryInterface.sequelize.query(
      'SELECT identity FROM Identities WHERE identity = "admin";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const [userData] = await queryInterface.sequelize.query(
      'SELECT identity FROM Identities WHERE identity = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const users = []
    const rootAdmin = {
      account: 'root',
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      nickname: 'root',
      cover_img: 'https://picsum.photos/800/300',
      avatar_img: 'https://i.pravatar.cc/300',
      role: adminData.identity,
      created_at: new Date(),
      updated_at: new Date()
    }
    users.push(rootAdmin)

    for (let i = 1; i < 6; i++) {
      const user = {
        account: `user${i}`,
        name: faker.internet.userName(),
        email: `user${i}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        nickname: faker.name.firstName(),
        cover_img: 'https://picsum.photos/800/300',
        avatar_img: 'https://i.pravatar.cc/300',
        introduction: faker.lorem.text(),
        role: userData.identity,
        created_at: new Date(),
        updated_at: new Date()
      }
      users.push(user)
    }

    await queryInterface.bulkInsert('Users', users, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
