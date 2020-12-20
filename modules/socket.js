function wrap(middleware) {
  return (socket, next) => middleware(socket.request, {}, next)
}


module.exports = {
  wrap
}