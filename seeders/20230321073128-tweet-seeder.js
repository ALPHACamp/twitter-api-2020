const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE role = 'user';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const tweetList = [];
    users.forEach((user) => {
      tweetList.push(
        ...Array.from({ length: 10 }, () => ({
          User_id: user.id,
          description: faker.lorem.sentence(),
          created_at: faker.date.recent(),
          updated_at: new Date(),
        }))
      );
    });
    await queryInterface.bulkInsert('Tweets', tweetList, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {});
  },
};
