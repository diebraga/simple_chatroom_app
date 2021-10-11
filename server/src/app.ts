import express from 'express'
import config from 'config'
import cors from 'cors'
import http from 'http'
import log from './logger'
import routes from './routes'
import { Server, Socket } from 'socket.io'

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

  socket.on('disconnect', () => {
    log.info('User disconnected', socket.id)
  })
})

server.listen(port, host, () => {
  log.info(`Server running at http://${host}:${port}`)

  routes(app)
})