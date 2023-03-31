'use strict'
const { sequelize } = require('../models')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先找出所有對應的user_id與tweet_id
    const tweetSeedData = await sequelize.query(`
WITH CTE AS
(SELECT t1.user_id, t2.id tweet_id, ROW_NUMBER() OVER (PARTITION BY t1.user_id ORDER BY RAND()) row_num FROM Tweets t1
JOIN
(SELECT id, user_id FROM Tweets) t2
WHERE t1.user_id <> t2.user_id)
SELECT user_id, tweet_id FROM CTE
WHERE row_num <= 3
    `, { type: sequelize.QueryTypes.SELECT })
    tweetSeedData.forEach(e => {
      e.comment = faker.lorem.paragraph()
      e.created_at = faker.date.past()
      e.updated_at = faker.date.recent()
    })

    await queryInterface.bulkInsert('Replies', tweetSeedData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies')
  }
}
