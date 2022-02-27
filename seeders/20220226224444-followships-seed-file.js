'use strict'
const { RandomChooser } = require('../helpers/seed-helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT * FROM users where role = 'user';", {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const userIds = users.map(user => user.id)
    const insertedFollowships = users.map(user => {
      let followTimes = Math.floor(Math.random() * userIds.length) // The number of followers: 0 ~ userIds.length - 1
      followTimes = !followTimes ? 1 : followTimes
      const followingIds = userIds.filter(x => x !== user.id)
      const followingRandomChooser = new RandomChooser(followingIds)

      // return Array.from({ length: followTimes }, () => ({
      //   followingId: followingRandomChooser.choose(),
      //   followerId: user.id,
      //   createdAt: newDate,
      //   updatedAt: newDate
      // })
      // )
      return Array.from({ length: followTimes }, () => {
        const newDate = new Date(+(user.createdAt) + Math.floor(Math.random() * 1000000000)) // add 10^9 milisecond from user createdAt date
        return {
          followingId: followingRandomChooser.choose(),
          followerId: user.id,
          createdAt: newDate,
          updatedAt: newDate
        }
      })
    }).flat()
    await queryInterface.bulkInsert('followships', insertedFollowships, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('followships', null, {})
  }
}
