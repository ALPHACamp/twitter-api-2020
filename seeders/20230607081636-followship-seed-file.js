'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users WHERE role = "user";', {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    })

    const followships = []
    const pairedUsers = []

    for (let i = 0; i < 20; i++) {
      let followerId
      let followingId

      do {
        // Randomly select following_id
        followingId = users[Math.floor(Math.random() * users.length)].id

        // Randomly select follower_id
        followerId = users[Math.floor(Math.random() * users.length)].id
      } while (followerId === followingId || isPairAlreadyExists(pairedUsers, followerId, followingId))

      // Add the pair to the pairedUsers array
      pairedUsers.push({ followerId, followingId })

      followships.push({
        following_id: followingId,
        follower_id: followerId,
        created_at: new Date(),
        updated_at: new Date(),
      })
    }

    await queryInterface.bulkInsert('Followships', followships)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  },
}

function isPairAlreadyExists(pairedUsers, followerId, followingId) {
  for (const pair of pairedUsers) {
    if (
      (pair.followerId === followerId && pair.followingId === followingId) ||
      (pair.followerId === followingId && pair.followingId === followerId)
    ) {
      return true
    }
  }
  return false
}
