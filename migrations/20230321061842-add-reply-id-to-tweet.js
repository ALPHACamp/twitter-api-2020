'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Tweets", "reply_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Replies",
        key: "id",
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Tweets", "reply_id");
  },
};

