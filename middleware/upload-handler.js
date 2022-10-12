const uploadFileHandler = (req, res, next) => {
  try {
    if (!req.files) {
      req.body.avatar = undefined
      req.body.coverPhoto = undefined
    } else {
      req.body.avatar = (req.files.avatar) ? req.files.avatar[0] : undefined
      req.body.coverPhoto = (req.files.coverPhoto) ? req.files.coverPhoto[0] : undefined
    }
    next()
  } catch (err) {
    console.log(err)
    const error = new Error('uploading failed')
    error.status = 403
    return next(err)
  }
}

module.exports = {
  uploadFileHandler
}
