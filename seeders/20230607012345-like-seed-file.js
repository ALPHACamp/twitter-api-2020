'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert(
      "Likes",
      Array.from({ length: 50 }, (d, i) => ({
        User_Id: users[Math.floor(Math.random() * users.length)].id,
        Tweet_Id: tweets[Math.floor(Math.random() * tweets.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
