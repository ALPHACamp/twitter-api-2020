const express = require("express");
const router = express.Router();


router.get("/",(req, res) => {
  res.send("tweet here")
})

module.exports = router;