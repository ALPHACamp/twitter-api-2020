'use strict'

const { randomPicks } = require('../helpers/seeds')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Each user have two random follows exclude user self

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

    // Update users' data (followingCount, followerCount)
    const followingData = await queryInterface.sequelize.query(
      `
      SELECT 
        count(id) as followingCount,
        followerId as userId
      FROM followships
      GROUP BY followerId
      ORDER BY userId;
      `,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const followerData = await queryInterface.sequelize.query(
      `
      SELECT 
        count(id) as followerCount,
        followingId as userId
      FROM followships
      GROUP BY followingId
      ORDER BY userId;
      `,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    for (const [i, data] of followingData.entries()) {
      await queryInterface.sequelize.query(
        `
        Update Users
        SET
        followingCount = ${data.followingCount},
        followerCount = ${followerData[i].followerCount}
        WHERE id = ${data.userId}
        `,
        { type: queryInterface.sequelize.QueryTypes.UPDATE }
      )
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
