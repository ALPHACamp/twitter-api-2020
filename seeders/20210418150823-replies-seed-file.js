'use strict';

const User = db.User
const Tweet = db.Tweet

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: false } })
    const tweets = await Tweet.findAll()

    await queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 150 }).map((d, i) => ({
        UserId: users[Math.floor(Math.random() * users.length)].id,
        TweetId: ,
        comment: ,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {});
  }
};
