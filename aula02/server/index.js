const server = require('http').createServer((req, res)=>{
    res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    })

    res.end('hei there!')
})

const socketIo = require('socket.io')
const io = socketIo(server, {
    cors: {
        origin: '*',
        credentials: false
    }
})

io.on('connect', socket =>{
    console.log('connection', socket.id)

    socket.on('join-room', (roomId, userId)=>{
        //adcion os usuários numa mesma sala
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
        socket.on('disconnect', ()=>{
            console.log('disconnected', roomId,userId)
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

const createServer = () => {
    const { address, port } = server.address()
    console.info(`server on ${address}:${port}`)
}

server.listen( process.env.PORT || 3000, createServer)