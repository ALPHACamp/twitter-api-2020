'use strict';
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
    for (let t of tweets) {

      // generate array of 3 random distinct non-admin user id
      const userArray = []
      do {
        let randId = users[Math.floor(Math.random() * users.length)].id
        if (!userArray.some(u => u === randId) && !adminId.some(a => a.id === randId)) {
          userArray.push(randId)
        }
      } while (userArray.length < 3)

      // generate 3 replies to current tweet by userArray
      for (let u of userArray) {
        replies.push({
          UserId: u,
          TweetId: t.id,
          comment: faker.lorem.text().substring(0, 50),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }

    await queryInterface.bulkInsert('Replies', replies)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
