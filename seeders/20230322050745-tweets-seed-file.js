'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 新增以下三行，先去查詢現在 Categories 的 id 有哪些
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE is_admin = 0;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: users.length * 10 }, (_, i) => ({
        // description: faker.lorem.text(), // 會過字數上限，先不用
        description: faker.lorem.words(10),
        created_at: new Date(),
        updated_at: new Date(),
        user_id: users[i % users.length].id
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
