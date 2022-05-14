'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const replies = await queryInterface.sequelize.query(
      'SELECT id FROM Replies;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const replyLikes = []

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < 20; j++) {
        const replyLike = {
          like_unlike: true,
          created_at: new Date(),
          updated_at: new Date(),
          user_id: users[i].id,
          reply_id: replies[Math.floor(Math.random() * replies.length)].id
        }
        if (i === 0 || replyLike.reply_id !== replyLikes[i - 1].reply_id) {
          replyLikes.push(replyLike)
        }
      }
    }

    await queryInterface.bulkInsert('ReplyLikes', replyLikes, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ReplyLikes', null, {})
  }
}
