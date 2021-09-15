'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Likes",
      Array.from({ length: 200 }).map((d, i) => ({
        id: i * 10 + 1,
        userId: (( i + 1 ) % 10 + 1) * 10 + 1,
        tweetId: (Math.floor( i / 3 )) * 10 + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Likes', null, { truncate: true, cascade: false })
  }
};
