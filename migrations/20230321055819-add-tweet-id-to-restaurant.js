'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "tweet_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Tweets",
        key: "id",
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "tweet_id");
  },
};
