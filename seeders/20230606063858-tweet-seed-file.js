'use strict'
const { getDate } = require('../_helpers')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM user;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const dateArray = getDate(50)
    for (let i = 1; i < 6; i++) {
      await queryInterface.bulkInsert('Tweets', Array.from({ length: 10 }, (_, index) => ({
        User_id: users[i].id,
        description: `這是我的第${index + 1}篇推文，好爽，耶嘿！`,
        likable: true,
        commendable: true,
        created_at: dateArray[10 * (i - 1) + index],
        updated_at: dateArray[10 * (i - 1) + index]
      })))
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
