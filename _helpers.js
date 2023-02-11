//const allowlist = ['http://localhost:8080']

const helpers = {
  getUser: (req) => {
    return req.user
  },
 // corsOptionsDelegate: (req, callback) => {
  //  let corsOptions
  //  if (allowlist.indexOf(req.header('Origin') !== -1)) {
  //    corsOptions = { origin: true }
   // } else {
   //   corsOptions = { origin: false }
 //   }
  // callback(null, corsOptions)
//  }
}

module.exports = helpers
