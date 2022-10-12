'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Tweets',[{
      user_id: users[ users.length - 1 ].id,
      description: '這是種子檔產生的，用以凸顯時間順序的假文，來自未來的文章。',
      created_at: '2222-12-01 05:53:55',
      updated_at: '2222-12-01 05:53:55',
      },
      {
      user_id: users[ users.length - 2 ].id,
      description: '這也是種子檔產生的，用以凸顯時間順序的假文，來自未來的文章。',
      created_at: '2222-12-02 05:53:55',
      updated_at: '2222-12-02 05:53:55',
      },
      {
      user_id: users[ users.length - 3 ].id,
      description: '這還是種子檔產生的，用以凸顯時間順序的假文，來自未來的文章。',
      created_at: '2222-12-03 05:53:55',
      updated_at: '2222-12-03 05:53:55',
      }
  ])},
  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Likes', {});
  }
}
