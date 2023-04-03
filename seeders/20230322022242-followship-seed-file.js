'use strict'

const { shuffledArray } = require('../helpers/math-helpers.js')

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const users = await queryInterface.sequelize.query("SELECT id FROM Users WHERE role = 'user';", { type: queryInterface.sequelize.QueryTypes.SELECT })

//     await queryInterface.bulkInsert('Followships', Array.from({ length: 100 }, (_, index) => ({
//       created_at: new Date(),
//       updated_at: new Date(),
//       following_id: shuffledArray(users)[index % 20].id,
//       follower_id: shuffledArray(users)[index % 20].id
//     })))
//     await queryInterface.sequelize.query('DELETE FROM followships WHERE following_id = follower_id;', { type: queryInterface.sequelize.QueryTypes.DELETE })
//   },
//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete('followships', null, {})
//   }
// }
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query("SELECT id FROM Users WHERE role = 'user';", { type: queryInterface.sequelize.QueryTypes.SELECT })

    for (let i = 0; i < 100; i++) {
      const followingId = shuffledArray(users)[i % 20].id
      const followerId = shuffledArray(users)[i % 20].id

      const existingFollowship = await queryInterface.sequelize.query(
        'SELECT * FROM followships WHERE following_id = ? AND follower_id = ?',
        { replacements: [followingId, followerId], type: queryInterface.sequelize.QueryTypes.SELECT }
      )

      if (existingFollowship.length === 0) {
        await queryInterface.bulkInsert('Followships', [{
          created_at: new Date(),
          updated_at: new Date(),
          following_id: followingId,
          follower_id: followerId
        }])
      }
    }
    await queryInterface.sequelize.query('DELETE FROM followships WHERE following_id = follower_id;', { type: queryInterface.sequelize.QueryTypes.DELETE })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('followships', null, {})
  }
}
