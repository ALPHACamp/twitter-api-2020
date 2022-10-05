'use strict'
const { User } = require('../models')
const { userSeed } = require('./user-seed.json')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await User.queryInterface.bulkInsert('Users', userSeed.map(seed => {
      seed.created_at = new Date()
      seed.updated_at = new Date()
      return seed
    }))
  },

  down: async (queryInterface, Sequelize) => {
    await User.queryInterface.bulkDelete('User')
  }
}
