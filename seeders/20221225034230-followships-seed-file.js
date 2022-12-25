'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const followers = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const followings = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const followerIdArr = []
    const followingIdArr = []

    while (followerIdArr.length < 30) {
      const followerId = followers[Math.floor(Math.random() * followers.length)].id
      const followingId = followings[Math.floor(Math.random() * followings.length)].id
      if (followerId !== followingId) {
        followerIdArr.push(followerId)
        followingIdArr.push(followingId)
      }
    }

    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 30 }, (_, i) => ({
        follower_id: followerIdArr[i],
        following_id: followingIdArr[i],
        created_at: new Date(),
        updated_at: new Date()
      }))

    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
