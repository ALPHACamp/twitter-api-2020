const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      Array.from({ length: 10 }, (_, i) =>
        i === 0
          ? {
              // admin account
              email: 'root@example.com',
              account: 'root',
              password: bcrypt.hashSync('12345678', 10), // 直接使用hashSync同步生成hash
              role: 'admin',
              name: 'root',
              avatar: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 100)}`,
              introduction: faker.lorem.words(5),
              cover: `https://loremflickr.com/640/480/city?lock=${Math.floor(Math.random() * 100)}`,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          : {
              // at least 5 users
              email: `user${i}@example.com`,
              account: `user${i}`,
              password: bcrypt.hashSync('12345678', 10),
              name: `user${i}`,
              avatar: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 100)}`,
              introduction: faker.lorem.words(5),
              cover: `https://loremflickr.com/640/480/city?lock=${Math.floor(Math.random() * 100)}`,
              createdAt: new Date(),
              updatedAt: new Date()
            }
      ),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', {})
  }
}
