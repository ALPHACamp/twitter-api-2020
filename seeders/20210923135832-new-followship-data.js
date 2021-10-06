'use strict';
const db = require('../models')
const User = db.User

const getUserId = new Promise((resolve, reject) => {
  User.findAll({
    raw: true,
    nest: true,
    where: { role: 'user' }
  })
    .then(users => {
      const userIds = []
      users.forEach(user => {
        userIds.push(user.id)
      })
      return resolve(userIds)
    })
})

function followships(userIds) {
  const allFollowships = []
  let followingCount = 4
  userIds.forEach(userId => {
    let currentFollowing = (Number(userId) + 10)
    for (let i = followingCount; i >= 0; i--) {
      const followship = {
        followerId: userId,
        followingId: currentFollowing,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      currentFollowing += 10
      allFollowships.push(followship)
    }
    followingCount -= 1
  })
  return allFollowships
}


module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userIds = await getUserId
    const followshipSeed = followships(userIds)
    await queryInterface.bulkInsert('Followships', followshipSeed, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};