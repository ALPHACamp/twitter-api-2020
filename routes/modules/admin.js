const express = require("express");
const adminController = require("../../controllers/adminControllers");
const router = express.Router();

router.post('/signin', adminController.adminSignIn)

module.exports = router;
