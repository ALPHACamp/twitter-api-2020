const helpers = require('../_helpers')
const { Like } = require('../models')

module.exports = {
  // Return an array of id numbers for check followships
  // followship should be string and either be "Followings" or "Followers"
  getFollowshipId: (req, followship) => {
    const user = helpers.getUser(req)
    const followshipIds = []
    user[followship].forEach(user => followshipIds.push(user.dataValues.id))
    return followshipIds
  },

  // Return an array of id numbers of current user's liked tweets
  getLikedTweetsIds: async req => {
    const user = helpers.getUser(req)
    const userLikes = await Like.findAll({
      where: { UserId: user.id },
      raw: true
    })
    const likedIds = userLikes.map(like => like.TweetId)

    return likedIds
  }
}
