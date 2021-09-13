'use strict';

const followship = require("../models/followship");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Followships",
      Array.from({ length: 50 }).map((d, i) => ({
        id: i * 10 + 1,
        followerId: ( ( i + 1 ) % 10 ) * 10 + 1,
        followingId: ( ( i % 9 ) + 2 ) * 10 + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, { truncate: true, cascade: false} )
  }
};
