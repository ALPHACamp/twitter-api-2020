const express = require('express');

const router = express.Router();
const upload = require('../../middleware/multer');

const userController = require('../../controllers/user-controller');

router.put(
  '/:id',
  upload.fields([{ name: 'avatar' }, { name: 'cover_image' }]),
  userController.editUserProfile
);

router.put('/:id/setting', userController.editUserSetting);

router.get('/:id', userController.getUser);

router.get('/', (req, res) =>
  res.send(`You pass the authentication to here by path /users`)
);

module.exports = router;
