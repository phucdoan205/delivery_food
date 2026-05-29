require('dotenv').config()

const app = require('./src/app')
const connectDB = require('./src/config/db')
const http = require('http')
const { Server } = require('socket.io')

connectDB()

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*', // Allows all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
})

// Make io accessible to controllers
app.set('io', io)

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  
  socket.on('join', (room) => {
    socket.join(room)
    console.log(`Socket ${socket.id} joined room ${room}`)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`)
})