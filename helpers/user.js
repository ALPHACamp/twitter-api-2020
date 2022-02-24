const helpers = require('../_helpers')

module.exports = {
  // Return an array of IDs for check followships
  // followship should be string and either be "Followings" or "Followers"
  getFollowshipId: (req, followship) => {
    const user = helpers.getUser(req)
    return user[followship]
  }
}
