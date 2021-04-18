const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')

const userController = require('../../controllers/userController')

/**
* @swagger
* /api/users:
*   get:
*     summary: Retrieve a list of users of Simple Twitter.
*     description: Retrieve a list of users from Simple Twitter.
*     responses:
 *       200:
 *         description: A list of users.
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
 *                       id:
 *                         type: integer
 *                         description: The user ID.
 *                         example: 0
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
*/



router
  .route('/')
  .get(authenticated, (req, res) => res.send('Hello World!'))
  /**
* @swagger
* /api/users:
*   post:
*     summary: Register an account Simple Twitter.
*     description: Register an account Simple Twitter.
*/
  .post(userController.register)




router.post('/login', userController.login)

module.exports = router
