'use strict'
const { getDate } = require('../_helpers')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE id > (SELECT MIN(id) FROM Users);',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const followships = new Set()
    const followshipArray = []

    while (followships.size <= 10) {
      const followerId = users[Math.floor(Math.random() * users.length)].id
      let followingId = users[Math.floor(Math.random() * users.length)].id

      while (followerId === followingId || followships.has(`${followerId}-${followingId}`)) {
        followingId = users[Math.floor(Math.random() * users.length)].id
      }

      followships.add(`${followerId}-${followingId}`)

      followshipArray.push({
        follower_Id: followerId,
        following_Id: followingId,
        created_at: getDate(),
        updated_at: getDate()
      })
    }

    await queryInterface.bulkInsert('Followships', followshipArray)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
