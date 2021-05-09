'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Subscriptions', {
      fields: ['subscriberId'],
      type: 'foreign key',
      name: 'subscriberId_fk_user_id',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    await queryInterface.addConstraint('Subscriptions', {
      fields: ['authorId'],
      type: 'foreign key',
      name: 'authorId_fk_user_id',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'Subscriptions',
      'subscriberId_fk_user_id'
    )
    await queryInterface.removeConstraint(
      'Subscriptions',
      'authorId_fk_user_id'
    )
  }
}
