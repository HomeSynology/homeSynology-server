const Koa = require('Koa');
const {promisify} = require('util')

const server = require('http').createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain'})
  // 发送响应数据 "Hello World"
  response.end('Hello World\n')
})
const io = require('socket.io')(server)
let socketIDs = []
io.on('connection', function (socket) {
  console.log('syn server connection id:', socket.handshake.query)
  socketIDs[socket.handshake.query.synoKey] = socket
  beatHeart(socket)
})

const getConnSocket = (synoKey) => {
  if(!synoKey){
    return socketIDs
  }
  return socketIDs[synoKey]
}

function beatHeart(socket) {
  setTimeout(function () {
    socket.emit('beat', '💓 ^_^')
    beatHeart(socket)
  }, 10000)
}


server.listen(5002)

module.exports = getConnSocket
