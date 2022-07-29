'use strict'

const { randomPick } = require('../helpers/seeder-helper')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const seedFollowships = []
    users.map((user, index) => {
      const followerId = user.id
      const followingRange = users.slice()
      followingRange.splice(index, 1)
      const followingCount = Math.ceil(Math.random() * (users.length - 1))
      const userFollowings = randomPick(followingRange, followingCount)

      return userFollowings.forEach(u => seedFollowships.push({
        followerId,
        followingId: u.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    })

    await queryInterface.bulkInsert('Followships', seedFollowships)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {}, { truncate: true })
  }
}
