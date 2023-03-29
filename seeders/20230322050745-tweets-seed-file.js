'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 新增以下三行，先去查詢現在 Users 的 id 有哪些
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweetAmount = users.length * 2 // ! 最後要改回 ... * 10 ~~~~~~~~~~

    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: tweetAmount }, (_, i) => ({
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
