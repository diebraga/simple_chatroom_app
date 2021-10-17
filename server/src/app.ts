import express from 'express'
import config from 'config'
import cors from 'cors'
import http from 'http'
import log from './logger'
import routes from './routes'
import { Server, Socket } from 'socket.io'
import { JoinRoomEvent, ReceiveMessageEvent } from './types'

const port = config.get('port') as number
const host = config.get('host') as string

const app = express()

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket: Socket) => {
  log.info(`User connected id: `+socket.id)

  socket.on("join_room", (data: JoinRoomEvent) => {
    socket.join(data.room);
    log.info(`${data.username} joined the room ${data.room}`);
    socket.to(data.room).emit("join_room", `${data.username} joined the room`);
  });

  socket.on("send_message", (data: ReceiveMessageEvent) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    log.info("User Disconnected", socket.id);
  });
})

server.listen(port, host, () => {
  log.info(`Server running at http://${host}:${port}`)

  routes(app)
})