const http = require('http').Server(app);
var io = require('socket.io')(http);

module.exports = {
    sendMessage: async (req, res, next) => {
        try {
            console.log()
        } catch (error) {
            next(error);
        }
    }
}