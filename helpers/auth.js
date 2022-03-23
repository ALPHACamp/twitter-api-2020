const passport = require('../config/passport')
const helpers = require('../_helpers')
const jwt = require('jsonwebtoken')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user)
      return res
        .status('401')
        .json({ status: 'error', message: 'Unauthorized, please login!' })

    req.user = user.dataValues

    return next()
  })(req, res, next)
}

const blockRole = (role) => {
  return (req, res, next) => {
    
    if (helpers.getUser(req).role !== role) return next()

    return res
      .status('403')
      .json({ status: 'error', message: 'Permission denied.' })
  }
}

const authenticatedSocket = (socket, next) => {
  console.log('=== Socket auth ===')

  // Mock socket auth
  socket.handshake.auth.token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyMUBleGFtcGxlLmNvbSIsInBhc3N3b3JkIjoiJDJhJDEwJGRTbHBQWWlVMVg2Qm5FL2M2Nm4wZXVpVmU3aVVHZzJrSWVJVmQ2M0c1dllNTzBGQ1JqQVFLIiwibmFtZSI6InVzZXIxIiwiYWNjb3VudCI6InVzZXIxIiwiY292ZXIiOiJodHRwczovL2kuaW1ndXIuY29tL2p1NXdGdDMuanBnIiwiYXZhdGFyIjoiaHR0cHM6Ly9pLmltZ3VyLmNvbS9oQUtjUzNFLmpwZyIsImludHJvZHVjdGlvbiI6bnVsbCwicm9sZSI6InVzZXIiLCJsaWtlZENvdW50IjoyMCwicmVwbGllZENvdW50IjozMCwiZm9sbG93aW5nQ291bnQiOjIsImZvbGxvd2VyQ291bnQiOjEsImNyZWF0ZWRBdCI6IjIwMjItMDMtMDVUMDg6NDE6MDcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMDVUMDg6NDE6MDcuMDAwWiIsImlhdCI6MTY0NjU1MDkzMiwiZXhwIjoxNjQ3MTU1NzMyfQ.g-7ajYKDOIzqRCbfyCp2IxDnbQBEMsdJzS9rdIlwHFo'

  if (!socket.handshake.auth.token) throw Error('No socket token!')
  jwt.verify(
    socket.handshake.auth.token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        next(err)
      }
      socket.user = decoded
    }
  )
  next()
}

module.exports = {
  authenticated,
  blockRole,
  authenticatedSocket
}
