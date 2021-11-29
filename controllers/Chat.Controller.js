const socketio = require('socket.io');

const initialize = (server) => {
    console.log('socket io initialized');
    const io = socketio(server, {
        cors: {
            origin: '*',
        }
    });

    io.on('connection', (socket) => {
        console.log('user connected of id : ' + socket.id);

        socket.on('disconnect', ()=> {
            console.log('user disconnected of Id : ' + socket.id);
        });
    })
}

module.exports = {
    initialize,
    sendMessage: async (req, res, next) => {
        try {
            console.log()
        } catch (error) {
            next(error);
        }
    }
};