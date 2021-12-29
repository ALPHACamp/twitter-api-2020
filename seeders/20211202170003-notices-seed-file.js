'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const noticeArray = []
    for (let i = 1; i < 11; i++) {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(number => number !== i)
      noticeArray.push({
        id: i,
        noticerId: i,
        noticingId: numbers[Math.floor(Math.random() * 9)],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    await queryInterface.bulkInsert('Notices', noticeArray, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Notices', null, {})
  }
}
