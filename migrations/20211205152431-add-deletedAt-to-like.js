'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addColumn('Likes', 'deletedAt', {
      type: Sequelize.STRING,
      defaultValue: ""
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Likes', 'deletedAt')
  }
};
