const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let usersPosts = []

    const users = Array.from({length: 5}).map((item, i) => ({
      UserId: i + 2
    }))

    users.forEach((user, userIndex) => {
      const posts = Array.from({ length: 10 }).map((post, postIndex) => ({
        id: userIndex * 10 + (postIndex + 1),
        UserId: user.UserId,
        description: faker.lorem.sentence(5, 139),
        replyCount: 3,
        likeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }))

      usersPosts = usersPosts.concat(posts)
    })

    await queryInterface.bulkInsert('Tweets', usersPosts, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
};
