const helpers = require('../_helpers')

const userController = {
  readUser: (req, res) => {
    console.log(helpers.getUser(req).toJSON())
    res.send(`Hello User ${helpers.getUser(req).name}!`)
  },
  readTweets: (req, res) => {

  },
  readRepliedTweets: (req, res) => {

  },
  readLikes: (req, res) => {

  },
  readFollowings: (req, res) => {

  },
  readFollowers: (req, res) => {

  },
  updateUser: (req, res) => {

  }
}

module.exports = userController
