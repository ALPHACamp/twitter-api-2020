'use strict'

const { shuffledArray } = require('../helpers/math-helpers.js')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query("SELECT id FROM Users WHERE role = 'user';", { type: queryInterface.sequelize.QueryTypes.SELECT })

    await queryInterface.bulkInsert('Followships', Array.from({ length: 100 }, (_, index) => ({
      created_at: new Date(),
      updated_at: new Date(),
      following_id: shuffledArray(users)[index % 20].id,
      follower_Id: shuffledArray(users)[index % 20].id
    })))
    await queryInterface.sequelize.query('DELETE FROM followships WHERE following_id = follower_id;', { type: queryInterface.sequelize.QueryTypes.DELETE })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('followships', null, {})
  }
}
