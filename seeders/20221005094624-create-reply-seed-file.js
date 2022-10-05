'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const replyArray = []
    for (let i = 1; i <= 50; i++) {
      for (let j = 0; j < 3; j++) {
        replyArray.push({
          comment: '留言測試',
          User_id: Math.floor((Math.random() * 5) + 2),
          Tweet_id: i,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }
    await queryInterface.bulkInsert('Replies', replyArray)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies')
  }
}
