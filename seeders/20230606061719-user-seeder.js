const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const avatarsIndex = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

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
              avatar: `https://i.pravatar.cc/300?img=${avatarsIndex[i]}`,
              introduction: faker.lorem.words(5),
              cover: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/640/480`,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          : {
            // at least 5 users
              email: `user${i}@example.com`,
              account: `user${i}`,
              password: bcrypt.hashSync('12345678', 10),
              role: 'user',
              name: `user${i}`,
              avatar: `https://i.pravatar.cc/300?img=${avatarsIndex[i]}`,
              introduction: faker.lorem.words(5),
              cover: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/640/480`,
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
