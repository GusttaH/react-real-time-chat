const { Socket } = require('dgram')
const app = require('express')()
const port = 5000
const http = require('http').createServer(app)
const io = require('socket.io')(http)

let messages = []
io.on('connection', (socket) => {
  console.log('Conected...', socket.id)

  socket.emit('previousMessages', messages)
  socket.on('sendMessage', data => {
    console.log(data)
    messages.push(data)
    socket.broadcast.emit('receivedMessage', data)
  })

  socket.on('specificMessage', data => {
    console.log(data)
    // messages.push(data)
    socket.broadcast.to(data.individualId).emit('receivedSpecificMessage', data);
  })
})

http.listen(port, () => {
  console.log('Listening... Port:', port)
})