'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Followships',
      Array.from({ length: 9 }).map((item, index) => ({
        id: index + 1,
        following_id: index + 1,
        follower_id: index + 2,
        created_at: new Date(),
        updated_at: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  },
}
