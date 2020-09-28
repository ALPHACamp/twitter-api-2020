'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', 'account', {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: ''
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', 'account', {
      allowNull: false,
      type: Sequelize.STRING
    })
  }
};
