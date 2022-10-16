// tweet-seed 指定規格：每個使用者有 10 篇 tweet。但管理者不該有 tweet 才合理。

'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE Users.role = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const usersLength = users.length // number of the seed users without admin
    const bulkAmount = usersLength * 10 // tweets per user
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: bulkAmount }, (_value, index) => ({
        description: faker.lorem.sentence(Math.floor(Math.random() * 5) + 1),
        // 建立時間設為隨機，方便觀察推文有無按時間排序。
        created_at: `2022-09-${Math.floor(Math.random() * 30 + 1)} 05:53:${Math.floor(Math.random() * 59)}`, 
        updated_at: new Date(),
        user_id: users[index % (users.length)].id
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
