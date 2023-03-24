const express = require('express');

const router = express.Router();
const followshipController = require('../../controllers/followship-controller');

router.post('/', followshipController.addFollowship);
router.delete('/:followingId', followshipController.removeFollowship);

module.exports = router;
