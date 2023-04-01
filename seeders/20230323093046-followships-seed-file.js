'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    let targetArr = []
    for (let j = 0; j < users.length; j++) {
      targetArr = targetArr.concat(
        Array.from({ length: users.length - j - 1 }, (_, i) => ({
          follower_id: users[j].id,
          following_id: users
            .filter((_, idx) => idx !== j)[i].id,
          is_notified: true,
          created_at: new Date(Date.now() + (targetArr.length + i) * 1000),
          updated_at: new Date(Date.now() + (targetArr.length + i) * 1000)
        }))
      )
    }
    await queryInterface.bulkInsert('Followships', targetArr)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
