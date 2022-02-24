const helpers = require('../_helpers')

module.exports = {
  // Return an array of id numbers for check followships
  // followship should be string and either be "Followings" or "Followers"
  getFollowshipId: (req, followship) => {
    const user = helpers.getUser(req)
    const followshipIds = []
    user[followship].forEach(user => followshipIds.push(user.dataValues.id))
    return followshipIds
  }
}
