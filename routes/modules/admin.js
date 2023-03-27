const express = require('express');

const router = express.Router();
const adminController = require('../../controllers/admin-controller');

router.delete('/tweets/:id', adminController.deleteTweet);
router.get('/users', adminController.getUsers);

router.get('/', (req, res) =>
  res.send(`You pass the authentication to here by /admin`)
);

module.exports = router;
