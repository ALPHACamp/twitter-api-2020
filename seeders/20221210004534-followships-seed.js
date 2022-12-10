'use strict'
const { FOLLOWSHIP_AMOUNT } = require('../helpers/seeder-helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT `id` FROM `Users` WHERE `role` = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const followships = []
    do {
      let followerId
      let followingId
      do {
        followerId = users[Math.floor(Math.random() * users.length)].id
        followingId = users[Math.floor(Math.random() * users.length)].id
      } while (
        followerId === followingId ||
        followships.join('、').includes(`${followerId},${followingId}`)
      )
      followships.push([followerId, followingId])
    } while (followships.length < FOLLOWSHIP_AMOUNT)
    await queryInterface.bulkInsert('Followships',
      Array.from({ length: FOLLOWSHIP_AMOUNT }, (_, i) => {
        return ({
          followerId: followships[i][0],
          followingId: followships[i][1],
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', { })
  }
}
