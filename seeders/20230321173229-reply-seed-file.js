'use strict'
const { sequelize } = require('../models')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先找出所有對應的user_id與tweet_id
    const tweetSeedData = await sequelize.query(`
WITH CTE AS (SELECT t.id tweet_id, u.id user_id, ROW_NUMBER() OVER (PARTITION BY t.id ORDER BY RAND()) row_num FROM Tweets t
JOIN Users u
ON t.user_id <> u.id )
SELECT tweet_id, user_id
FROM CTE
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
