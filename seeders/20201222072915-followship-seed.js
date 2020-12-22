'use strict';

const { random } = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const followships = []
    for (let followerId = 1; followerId <= 6; followerId++) {
      const followingId = Math.floor(Math.random() * 5) + 1
      if (followerId !== followingId) {
        followships.push({
          followerId: followerId,
          followingId: followingId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }
    await queryInterface.bulkInsert('Followships', followships, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
