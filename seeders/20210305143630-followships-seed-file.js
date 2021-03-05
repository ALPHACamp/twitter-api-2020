'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let followList = []
    for (let i = 1; i <= 5; i++) {
      for (let j = 1; j <= 5; j++) {
        if (i === j) continue
        const list = {
          followerId: i,
          followingId: j,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        followList.push(list)

      }
    }
    await queryInterface.bulkInsert('Followships', followList)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
