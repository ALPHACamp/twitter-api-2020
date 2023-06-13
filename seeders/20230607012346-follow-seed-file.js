'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const followships = new Set()
    const followshipArray = []

    while (followships.size < 11) {
      const followerId = users[Math.floor(Math.random() * users.length)].id
      let followingId = users[Math.floor(Math.random() * users.length)].id

      while (followerId === followingId || followships.has(`${followerId}-${followingId}`)) {
        followingId = users[Math.floor(Math.random() * users.length)].id
      }

      followships.add(`${followerId}-${followingId}`)

      followshipArray.push({
        follower_Id: followerId,
        following_Id: followingId,
        created_at: new Date(),
        updated_at: new Date()
      })
    }

    await queryInterface.bulkInsert('Followships', followshipArray)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
