const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE role = 'user';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const replies = [];
    tweets.forEach((tweet) => {
      replies.push(
        ...Array.from({ length: 3 }, () => ({
          User_id: users[Math.floor(Math.random() * users.length)].id,
          Tweet_id: tweet.id,
          comment: faker.lorem.sentence(),
          created_at: faker.date.recent(),
          updated_at: new Date(),
        }))
      );
    });

    await queryInterface.bulkInsert('Replies', replies, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {});
  },
};
