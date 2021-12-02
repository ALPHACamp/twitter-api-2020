const { Tweet, sequelize } = require("../models");
const { User } = require("../models");
const { Like } = require("../models");
const { Reply } = require("../models");

let tweetController = {
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({
        where: { id: 50 },
        include: [{ model: User }, { model: Like }, { model: Reply }],
      });

      const results = tweets.map((tweet) => ({
        id: tweet.dataValues.id,
        description: tweet.dataValues.description,
        createdAt: tweet.dataValues.createdAt,
        User: tweet.dataValues.User.toJSON(),
        likeCounts: tweet.dataValues.Likes.length,
        replyCounts: tweet.dataValues.Replies.length,
      }));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = tweetController;
