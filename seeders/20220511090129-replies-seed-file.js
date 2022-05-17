'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminId = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role="admin";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // 每篇 tweet 有隨機 3 個留言者，每個人有 1 則留言
    const replies = []
    for (const t of tweets) {
      const userArray = []
      do {
        const randomId = users[Math.floor(Math.random() * users.length)].id
        if (!userArray.some(u => u === randomId) && !adminId.some(a => a.id === randomId)) {
          userArray.push(randomId)
        }
      } while (userArray.length < 3)
      for (const u of userArray) {
        replies.push({
          user_id: u,
          tweet_id: t.id,
          comment: faker.lorem.text().substring(0, 50),
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }

    await queryInterface.bulkInsert('Replies', replies)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
