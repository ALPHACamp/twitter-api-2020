'use strict';
const { User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await User.findAll({ attributes: ['id'] })
    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 5 }).map((d, i) =>
      ({
        followerId: user[i].id,
        followingId: user[(i + 1) % 5].id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
