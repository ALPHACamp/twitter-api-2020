'use strict'
const { sequelize } = require('../models')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const followshipSeedData = await sequelize.query(`
    WITH CTE AS (SELECT u1.id follower_id, u2.id following_id, ROW_NUMBER() OVER (PARTITION BY u1.id ORDER BY RAND()) row_num FROM Users u1
JOIN
(SELECT id FROM Users) u2 WHERE u1.id <> u2.id)
SELECT follower_id, following_id FROM CTE
WHERE row_num <= FLOOR(RAND()*(SELECT COUNT(1)-1 FROM Users))
    `, { type: sequelize.QueryTypes.SELECT })
    followshipSeedData.forEach(e => {
      e.created_at = faker.date.past()
      e.updated_at = faker.date.recent()
    })

    await queryInterface.bulkInsert('Followships', followshipSeedData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships')
  }
}
