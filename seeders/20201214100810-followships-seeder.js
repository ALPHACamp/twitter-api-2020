'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      //every user has 1 ~ 5 followings and at least 1 follower
      const followings = []
      const followers = []
      for (let userId = 2; userId <= 6; userId++) {
        for (let i = 1; i <= Math.ceil(Math.random() * 4); i++) {
          followings.push({
            followerId: userId,
            followingId: Math.ceil(Math.random() * 5) + 1,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
        // every user has at least 1 follower
        followers.push({
          followerId: Math.ceil(Math.random() * 5) + 1,
          followingId: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
      await queryInterface.bulkInsert('Followships', followings)
      await queryInterface.bulkInsert('Followships', followers)
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
