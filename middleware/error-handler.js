module.exports = {
  errorHandler: (err, req, res, next) => {
    if (err instanceof Error) {
      res.status(200).json({
        status: 'error',
        message: `${err.message}`,
      });
    } else {
      res.status(200).json({
        status: 'error',
        message: `${err}`,
      });
    }
  },
};
