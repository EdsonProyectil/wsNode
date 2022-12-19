// -- Este es el archvio de servidor --

const path = require('path');
const express = require('express');
const app = express();

//Settings
// app.set('port', process.env.PORT || 3000);
app.set('port', 80);

// Static Files
// console.log(path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));   

// Start the server
const server = app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});

// WebSockets
const SocketIO = require('socket.io');
const { SocketAddress } = require('net');
const io = SocketIO(server);

io.on('connection', (socket) => {
    console.log('new connection', socket.id);

    // Aqui el servidor ESCUCHA (recibe) la accion del chat.js (cliente)
    // En teoria aqui iria el PHP ----
    socket.on('chat:message', (data) => {
        // console.log(data);

        // Aqui se envia la informacion del servidor al cliente
        io.sockets.emit('chat:message', data);
    });

    // Emitir a todos -----
    // socket.on('chat:typing', (data) =>{
    //     console.log(data);
    // });

    // Emitir a todos excepto al usuario que envia el dato --
    socket.on('chat:typing', (data) =>{
        socket.broadcast.emit('chat:typing', data);
    });
});
