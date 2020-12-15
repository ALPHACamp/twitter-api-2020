'use strict';
const { User } = require('../models/index')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' }, attributes: ['id'] })
    const userIds = users.map(u => u.id)

    const { shuffleArray } = require('../utils/helpers')

    const followships = []

    for (const id of userIds) {
      const followingCount = Math.floor(Math.random() * userIds.length)
      const userIdPool = userIds.filter(userId => userId !== id)
      shuffleArray(userIdPool)
      if (followingCount) {
        for (let i = 0; i < followingCount; i++) {
          followships.push({
            followerId: id,
            followingId: userIdPool[i],
            updatedAt: new Date(),
            createdAt: new Date()
          })
        }
      }
    }
    await queryInterface.bulkInsert('Followships', followships)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
