import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'

import { __dirname } from './utils.js'
import viewsRouter from './routes/views.routes.js'

const PORT = 5000

const app = express()
const httpServer = app.listen(PORT, () => {
    console.log(`Servicio activo en puerto ${PORT}`)
})

let messages = []
const io = new Server(httpServer)
io.on('connection', socket => {
    socket.emit('messagesLogs', messages)
    console.log(`Chat actual enviado a ${socket.id}`)

    socket.on('user_connected', data => {
        socket.broadcast.emit('user_connected', data)
    })

    socket.on('message', data => {
        messages.push(data)
        io.emit('messagesLogs', messages)
    })
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use('/', viewsRouter)

app.use('/static', express.static(`${__dirname}/public`))