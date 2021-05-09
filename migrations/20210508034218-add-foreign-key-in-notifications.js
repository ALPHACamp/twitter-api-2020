'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      'Notifications',
      'otherUserId',
      'receiverId'
    )
    await queryInterface.addConstraint('Notifications', {
      fields: ['TweetId'],
      type: 'foreign key',
      name: 'notifications_fk_tweet_id',
      references: {
        table: 'Tweets',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    await queryInterface.addConstraint('Notifications', {
      fields: ['ReplyId'],
      type: 'foreign key',
      name: 'notifications_fk_reply_id',
      references: {
        table: 'Replies',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    await queryInterface.addConstraint('Notifications', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'notifications_fk_user_id',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    await queryInterface.addConstraint('Notifications', {
      fields: ['receiverId'],
      type: 'foreign key',
      name: 'notifications_receiverId_fk_user_id',
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
      'Notifications',
      'notifications_fk_tweet_id'
    )
    await queryInterface.removeConstraint(
      'Notifications',
      'notifications_fk_reply_id'
    )
    await queryInterface.removeConstraint(
      'Notifications',
      'notifications_fk_user_id'
    )
    await queryInterface.removeConstraint(
      'Notifications',
      'notifications_receiverId_fk_user_id'
    )
    await queryInterface.renameColumn(
      'Notifications',
      'receiverId',
      'otherUserId'
    )
  }
}
