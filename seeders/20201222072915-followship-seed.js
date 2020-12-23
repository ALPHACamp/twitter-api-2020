'use strict';

const { random } = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const followships = []
    for (let followerId = 2; followerId <= 11; followerId++) {
      const followingId = Math.floor(Math.random() * 5) + 2
      if (followerId !== followingId) {
        followships.push({
          followerId: followerId,
          followingId: followingId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      } else {
        followships.push({
          followerId: followerId,
          followingId: followingId + 1,
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
