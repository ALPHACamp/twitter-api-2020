'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 取使用者id
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // 每個使用者
    for (const user of users) {
      const UserId = user.id
      // 生成10筆推文
      const tweets = Array.from({ length: 15 }, () => ({
        UserId,
        description: faker.lorem.text().substring(0, 140),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      // 建立推文
      await queryInterface.bulkInsert('Tweets', tweets)
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
