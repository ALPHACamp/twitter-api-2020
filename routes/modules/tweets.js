const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')
const tweetController = require('../../controllers/tweetController')

/**
 * @swagger
 * tags:
 *   name: Tweets
 *   description: Tweet related APIs.
 */


/**
* @swagger
* /api/tweets:
*   get:
*     summary: Retrieve a list of tweets.
*     description: Retrieve a list of tweet data includes id, UserId ...etc.
*     tags: [Tweets]
*     responses:
 *       200:
 *         description: A list of tweet info in an array.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The response status of GET /api/tweets.
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   description: The response message of GET /api/tweets.
 *                   example: 'successfully retrieved tweets data'
 *                 tweets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     additional properties:
 *                       type: string
 *                     example:
 *                       id: 1
 *                       UserId: 3
 *                       description: Ut doloribus qui maiores. Ea et placeat. Eos maiores rerum suscipit cupiditate. Minus debitis qui. Omnis veritatis id.
 *                       createdAt: 2021-04-18 15:06:37
 *                       updatedAt: 2021-04-18 15:08:40
 *                     
 * 
 */
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweets)
router.get('/:tweet_id', tweetController.getTweet)
router.post('/:tweet_id/like', tweetController.likeTweet)
router.post('/:tweet_id/unlike', tweetController.unlikeTweet)
router.post('/:tweet_id/replies', tweetController.postReply)
router.get('/:tweet_id/replies', tweetController.getReplies)

module.exports = router
