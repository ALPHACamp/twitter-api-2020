'use strict'

const { random } = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const followArray = []
    for (let i = 0; i < 10; i++) {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(number => number !== i)
      followArray.push({
        id: i + 1,
        followerId: i + 1,
        followingId: numbers[Math.floor(Math.random() * 9)],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    await queryInterface.bulkInsert('Followships', followArray, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
