module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('new-checkIn', newCheckIn=>{
      console.log('Somebody in the world checkin in')
      socket.broadcast.emit('new-checkIn', newCheckIn)
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}
