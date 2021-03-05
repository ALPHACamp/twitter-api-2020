'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Followships',
      [{
        id: 1,
        followerId: 11,
        followingId: 21,
        createdAT: new Date(),
        updatedAt: new Date()
      },
      {
        id: 11,
        followerId: 11,
        followingId: 31,
        createdAT: new Date(),
        updatedAt: new Date()
      },
      {
        id: 21,
        followerId: 21,
        followingId: 11,
        createdAT: new Date(),
        updatedAt: new Date()
      }
      ], {})
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
