const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')

const userController = require('../../controllers/userController')

/**
* @swagger
* /api/users:
*   get:
*     summary: Retrieve a list of users of Simple Twitter.
*     description: Retrieve a list of users of Simple Twitter. User data includes id, email, password ...etc. 
*     responses:
 *       200:
 *         description: A list of user info in an array.
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user's ID.
 *                         example: 0
 *                       email:
 *                         type: string
 *                         description: The user's email.
 *                         example: 'example@example.com'
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: user
 *                       avatar:
 *                         type: string
 *                         description: The user's avatar.
 *                         example: 0.png
 *                       introduction:
 *                         type: string
 *                         description: The user's introduction.
 *                         example: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
 *                       role:
 *                         type: integer
 *                         description: The user's role.
 *                         example: 0
 *                       account:
 *                         type: string
 *                         description: The user's account.
 *                         example: '@user'
 *                       cover:
 *                         type: string
 *                         description: The user's profile cover.
 *                         example: 00.png
*/

router
  .route('/')
  .get(authenticated, (req, res) => res.send('Hello World!'))
  /**
* @swagger
* /api/users:
*   post:
*     summary: Register an account on Simple Twitter.
*     description: Register an account on Simple Twitter with required fields.
*     consumes:
*       - application/x-www-form-urlencoded
*     parameters:
*     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         description: Response status.
 *                         example: success
 *                       message:
 *                         type: string
 *                         description: Response message.
 *                         example: successfully registered an account
*/
  .post(userController.register)




router.post('/login', userController.login)

module.exports = router
