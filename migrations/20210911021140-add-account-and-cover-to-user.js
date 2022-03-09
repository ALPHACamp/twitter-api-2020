'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'account', {
      type: Sequelize.STRING
    })
    await queryInterface.addColumn('Users', 'cover', {
      type: Sequelize.STRING,
      defaultValue:
        'http://apy-ingenierie.fr/wp-content/plugins/uix-page-builder/uixpb_templates/images/UixPageBuilderTmpl/default-cover-6.jpg'
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'account')
    queryInterface.removeColumn('Users', 'cover')
  }
}
