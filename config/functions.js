

module.exports = {
  randomDate: function (start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  }
}