'use strict'

const { shuffledArray } = require('../helpers/math-helpers.js')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query("SELECT id FROM Users WHERE role = 'user';", { type: queryInterface.sequelize.QueryTypes.SELECT })

    await queryInterface.bulkInsert('Followships', Array.from({ length: 20 }, (_, index) => ({
      created_at: new Date(),
      updated_at: new Date(),
      followingId: shuffledArray(users)[index % 5].id,
      followerId: shuffledArray(users)[(index + 1) % 5].id
    })))
    await queryInterface.sequelize.query('DELETE FROM followships WHERE followingId = followerId;', { type: queryInterface.sequelize.QueryTypes.DELETE })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('followships', null, {})
  }
}
