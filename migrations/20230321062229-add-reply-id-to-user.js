'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "reply_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Replies",
        key: "id",
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "reply_id");
  },
};
