'use strict'

function getTweetsSeeds () {
  const array = []
  const now = new Date()
  for (let i = 2, id = 1; i < 7; i++) {
    for (let j = 1; j < 11; j++) {
      array.push({
        id: id,
        description: 'user' + (i - 1) + ' - tweet' + j,
        user_id: i,
        created_at: new Date(now.getTime() + (1000 * id)),
        updated_at: new Date(now.getTime() + (1000 * id))
      })
      id++
    }
  }
  return array
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets', getTweetsSeeds(), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
