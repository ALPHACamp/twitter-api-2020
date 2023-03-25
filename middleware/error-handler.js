module.exports = {
  apiErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      console.log(err);
      res.status(err.status || 500).json({
        status: `${err.status || 500}`,
        message: `${err.name}: ${err.message}`,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: `${err.name}: ${err.message}`,
      });
    }
  },
};
