const { User, Tweet, Reply } = require('../models')

const tweetController = {
    getTweets: async (req, cb) => {
        try{
            const tweets = await Tweet.findAll({
                include: User
            })
            return cb(null, tweets)
        }catch(err){
            return cb(err)
        }
    }

}
module.exports = tweetController