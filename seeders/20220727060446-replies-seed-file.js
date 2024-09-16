'use strict'

function getRepliesSeeds() {
  const array = []
  const now = new Date()

  for (let i = 1, id = 1; i < 51; i++) {
    const userIdArray = [2, 3, 4, 5, 6]
    for (let j = 0; j < 3; j++) {
      const random = Math.floor(Math.random() * userIdArray.length)
      array.push({
        id: id,
        user_id: userIdArray[random],
        tweet_id: i,
        comment: 'user' + (userIdArray[random] - 1) + ' reply',
        created_at: new Date(now.getTime() + (1000 * id)),
        updated_at: new Date(now.getTime() + (1000 * id))
      })
      userIdArray.splice(random, 1)
      id++
    }
  }
  return array
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies', getRepliesSeeds(), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
