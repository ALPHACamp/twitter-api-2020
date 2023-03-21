const express = require('express');

const router = express.Router();

router.get('/', (req, res) =>
  res.send(`You pass the authentication to here by /admin`)
);

module.exports = router;
