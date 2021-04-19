'use strict'

module.exports = {

  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Followships', [
      {
        id: 1,
        followingId: 2,
        followerId: 3,
        createdAt: new Date(),
        updatedAt: new Date()

      },
      {
        id: 2,
        followingId: 2,
        followerId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        followingId: 3,
        followerId: 2,
        createdAt: new Date(),
        updatedAt: new Date()

      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
