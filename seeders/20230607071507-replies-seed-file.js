'use strict';

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
<<<<<<< HEAD

    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }, (v, i) => ({
        user_id: users[i % 5].id, // 照user順序分配reply
        tweet_id: tweets[Math.floor(i / 3)].id, // 每個tweet照順序分配3個reply
        comment: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        
=======
    
    await queryInterface.bulkInsert('Likes',
      Array.from({ length: 50 }, () => ({
        user_id: users[Math.floor(Math.random() * users.length)].id,
        tweet_id: tweets[Math.floor(Math.random() * tweets.length)].id,
        created_at: new Date(),
        updated_at: new Date()
>>>>>>> e08c474e301b8a9cea3aef7e53ba83f7fc7f8acd
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
};