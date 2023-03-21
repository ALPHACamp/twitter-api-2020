module.exports = {
  apiErrorHandler(err, res) {
    if (err instanceof Error) {
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
