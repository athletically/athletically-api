const websocket = require('../../app/websockets/websocket');
const socketio = require('socket.io');
const appConfig = require('../../config/appConfig');


let startSocket = (server) => {
    let io = socketio(server,{
        cors: {
          origin: '*',
        }
      });
    let gameIO = io.of(`/${appConfig.socketNameSpace}`);
    websocket.setNSP(gameIO);
    // console.log('Socket Connected... io = ' + gameIO);
}

module.exports = {
    startSocket:startSocket
}