const express = require('express');

const router = express.Router();

const userController = require('../../controllers/user-controller');

router.get('/:id', userController.getUser);

router.get('/', (req, res) =>
  res.send(`You pass the authentication to here by path /users`)
);

module.exports = router;
