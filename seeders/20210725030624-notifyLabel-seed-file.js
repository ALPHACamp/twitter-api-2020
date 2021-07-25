'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const labels = [{
      labelName: 'tweet',
      title: '有新的推文通知'
    }, {
      labelName: 'like',
      title: '喜歡你的推文'
    }, {
      labelName: 'followship',
      title: '開始追蹤你'
    }, {
      labelName: 'reply',
      title: '你的貼文有新的回覆'
    }
    ]


    const notifyLabels = Array.from(labels, (label, index) => ({
      id: index + 1,
      labelName: label.labelName,
      title: label.title,
      createdAt: new Date(),
      updatedAt: new Date()
    }))



    await queryInterface.bulkInsert('notifyLabels', notifyLabels, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('notifyLabels', {})

  }
};
