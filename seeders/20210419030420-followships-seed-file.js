'use strict';
const db = require('../models')
const User = db.User

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll()
    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 4 }).map((d, i) =>
      ({
        followerId: users[i + 2].id,
        followingId: users[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {});
    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 3 }).map((d, i) =>
      ({
        followerId: users[i + 3].id,
        followingId: users[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};