const moment = require('moment')

module.exports = {
  moment: function (a) {
    return moment(a).fromNow()
  }
}
