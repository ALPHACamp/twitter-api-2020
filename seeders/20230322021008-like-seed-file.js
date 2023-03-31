'use strict'
const { sequelize } = require('../models')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const likeSeedData = await sequelize.query(`
    WITH CTE AS (SELECT t.id tweet_id, u.id user_id, ROW_NUMBER() OVER (PARTITION BY t.id ORDER BY RAND()) row_num FROM Tweets t 
JOIN (SELECT * FROM Users) u ON t.user_id <> u.id)
SELECT tweet_id, user_id FROM CTE
WHERE row_num <= FLOOR(RAND()*(SELECT COUNT(1)-1 FROM Users))
    `, { type: sequelize.QueryTypes.SELECT })
    likeSeedData.forEach(e => {
      e.created_at = faker.date.past()
      e.updated_at = faker.date.recent()
    })
    await queryInterface.bulkInsert('Likes', likeSeedData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes')
  }
}
