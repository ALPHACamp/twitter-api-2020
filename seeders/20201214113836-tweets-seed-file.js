'use strict';
const { User } = require('../models/index')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' }, attributes: ['id'] })
    const userIds = users.map(u => u.id)
    const tweets = []

    for (const id of userIds) {
      for (let i = 0; i < 10; i++) {
        tweets.push({
          description: 'this is seed tweet',
          UserId: id,
          updatedAt: new Date(),
          createdAt: new Date()
        })
      }
    }
    await queryInterface.bulkInsert('Tweets', tweets)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
