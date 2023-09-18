let setNSP = (gameIo) => {
    let auth = require('../middlewares/auth');
    console.log(`socket server listening on NameSpace : ${gameIo.name}`);
    gameIo.use(auth.isAuthorizedSocket).on('connection',async (socket) => {

        /**
         * Connection Handler.
        **/
        console.log(`one socket connected:${socket.id} with user_id:${socket.user.user_id}`);

        /**
         * Socket Events For Application Logic.
        **/

        /**
         * Disconnection Handler.
        **/
        socket.on('disconnect',async () => {
            console.log(`one socket disconnected:${socket.id} with user_id:${socket.user.user_id}`);
        });
    });
}

module.exports = {
    setNSP:setNSP
}