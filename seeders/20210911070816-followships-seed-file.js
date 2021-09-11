'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Followships',
      Array.from({ length: 5 }).map((followship, index) => ({
        id: index * 10 + 5,
        followerId: (index + 1) * 10 + 5,
        followingId: ((index % 4) + 2) * 10 + 5,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, { truncate: true })
  }
}
