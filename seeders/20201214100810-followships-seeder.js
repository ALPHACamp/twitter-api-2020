'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      //使用者follow UserId比自己大者
      const followings = []
      for (let userId = 2; userId <= 6; userId++) {
        for (let followingId = userId + 1; followingId <= 6; followingId++) {
          followings.push({
            followerId: userId,
            followingId,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      }
      await queryInterface.bulkInsert('Followships', followings)
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('Followships', {})
    } catch (error) {
      console.log(error)
    }
  }
};
