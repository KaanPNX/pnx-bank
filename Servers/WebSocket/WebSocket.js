const { wsServer } = require("../Servers");

wsServer.on('connection',(socket) => {
    socket.on('message',(message) => {
        var payload = message.toString();
        console.log(payload);
    });
});