'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'avatar', {
      type: Sequelize.STRING,
      defaultValue: 'https://i.imgur.com/HD4yT2V.png' // 新增 defaultValue
    })

    await queryInterface.changeColumn('Users', 'banner', {
      type: Sequelize.STRING,
      defaultValue: 'https://i.imgur.com/bW0IDLD.png' // 新增 defaultValue
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'avatar', {
      type: Sequelize.STRING,
      defaultValue: null
    })

    await queryInterface.changeColumn('Users', 'banner', {
      type: Sequelize.STRING,
      defaultValue: null
    })
  }
}
