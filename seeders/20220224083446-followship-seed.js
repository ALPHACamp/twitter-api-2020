'use strict'

const { randomPicks } = require('../helpers/seeds')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Each user have two random follows exclude user self

    // "followerId": 2,
    // "followingId": 5,

    // Select users
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const followships = []
    // Make user a queue to avoid self following
    let temp
    for (let i = 0; i < users.length; i++) {
      temp = users.shift()
      const randomUsers = randomPicks(users, 2)
      const randomFollows = randomUsers.map(user => ({
        followerId: temp.id,
        followingId: user.id
      }))

      followships.push(...randomFollows)
      users.push(temp)
    }
    await queryInterface.bulkInsert('Followships', followships, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
