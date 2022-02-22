'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // randomly set (users.length * 2) followships for 6 users, no duplicate like
    const followshipArray = []
    do {
      let randFollowerId = users[Math.floor(Math.random() * users.length)].id
      let randFollowingId = users[Math.floor(Math.random() * users.length)].id

      if (!followshipArray.some(follow => follow.followerId === randFollowerId && follow.followingId === randFollowingId)) {

        if (randFollowerId !== randFollowingId) {
          followshipArray.push({
            followerId: randFollowerId,
            followingId: randFollowingId,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      }
    } while (followshipArray.length < users.length * 2)


    await queryInterface.bulkInsert('Followships', followshipArray)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}