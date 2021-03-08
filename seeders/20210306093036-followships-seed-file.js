'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const followsData = []
    let id = 1

    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 6; y++) {
        if (x !== y) {
          followsData.push(
            {
              id: id++,
              followerId: (10 * x) + 1,
              followingId: (10 * y) + 1,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          )
        }
      }
    }

    await queryInterface.bulkInsert('Followships', followsData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
