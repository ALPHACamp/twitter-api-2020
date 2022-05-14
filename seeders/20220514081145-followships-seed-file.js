'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const followShips = []

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < 3; j++) {
        const followShip = {
          created_at: new Date(),
          updated_at: new Date(),
          follower_id: users[i].id,
          following_id: users[Math.floor(Math.random() * users.length)].id
        }
        if (
          (i === 0 || followShip.following_id !== followShips[i - 1].following_id) &&
          followShip.follower_id !== followShip.following_id
        ) {
          followShips.push(followShip)
        }
      }
    }

    await queryInterface.bulkInsert('Followships', followShips, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
