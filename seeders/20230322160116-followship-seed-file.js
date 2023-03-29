'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DEFAULT_NUMBER = 15
    const users = await queryInterface.sequelize.query(
      `SELECT DISTINCT u1.id AS follower_id, u2.id AS following_id
      FROM Users u1, Users u2
      WHERE u1.role='user' AND u2.role='user' AND u1.id <> u2.id
      ORDER BY RAND()
      limit ${DEFAULT_NUMBER}`, { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Followships',
      users.map(user => ({
        follower_id: user.follower_id,
        following_id: user.following_id,
        created_at: faker.date.between('2023-03-20T00:00:00.000Z', '2023-03-28T00:00:00.000Z'),
        updated_at: new Date()
      })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
