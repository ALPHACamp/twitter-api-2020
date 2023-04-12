'use strict'
const { userSeed } = require('./user-seed.json')
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', userSeed.map(seed => {
      seed.password = bcrypt.hashSync(seed.password, 10)
      seed.created_at = new Date()
      seed.updated_at = new Date()
      return seed
    }))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users')
  }
}
