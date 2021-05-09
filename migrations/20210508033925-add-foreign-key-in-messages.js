'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Messages', {
      fields: ['ChatRoomId'],
      type: 'foreign key',
      name: 'messages_fk_chatroom_id',
      references: {
        table: 'ChatRooms',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    await queryInterface.addConstraint('Messages', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'messages_fk_user_id',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Messages', 'messages_fk_chatroom_id')
    await queryInterface.removeConstraint('Messages', 'messages_fk_user_id')
  }
}
