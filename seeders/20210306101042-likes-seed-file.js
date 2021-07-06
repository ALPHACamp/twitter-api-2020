'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const likesData = []
    let id = 1

    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 6; y++) {
        likesData.push(
          {
            id: id++,
            UserId: (10 * x) + 1,
            TweetId: id,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        )
      }
    }

    await queryInterface.bulkInsert('Likes', likesData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};
