const mongoose = require('mongoose');
let setNSP = (gameIo) => {
    let auth = require('../middlewares/auth');
    let commonController = require('../controllers/commonController');
    console.log(`socket server listening on NameSpace : ${gameIo.name}`);
    gameIo.use(auth.isAuthorizedSocket).on('connection',async (socket) => {
        // console.log(socket);
        /**
         * Connection Handler.
        **/
        console.log(`Socket connected: ${socket.id} with user_id: ${socket.user.user_id}`);

        // Listen for a joinGroup event
        socket.on('joinGroup', async (groupId) => {
            try {
                const userId = socket.user.user_id;
                
                // Join the group room
                socket.join(groupId);
        
                // Broadcast to the group that a new member has joined
                socket.to(groupId).emit('memberJoined', { userId, groupId });
        
                // Optionally, you can fetch user details from the database to include in the broadcast
                const user = await commonController.getUserById(userId);
                if (user) {
                    socket.to(groupId).emit('memberJoined', { user, groupId });
                }
        
                console.log(`User ${userId} joined group ${groupId}`);
            } catch (error) {
                console.error('Error joining group:', error);
            }
        });

        socket.on('sendMessage', async (messageData) => {
            try {
                console.log(messageData);
              const { group_id, sender_id, message_content, message_file_path, reply_to } = messageData;
              const newMessage = {
                group_id: mongoose.Types.ObjectId(group_id),
                sender_id: mongoose.Types.ObjectId(sender_id),
                message_content,
                // message_file_path,
                reply_to,
                read_status: 1, // Message is on the way
                datetime: new Date().getTime(),
                status: 'active'
              };

              // Emit the message to all users in the group
              socket.to(group_id).emit('receiveMessage', newMessage);
      
              const savedMessage = await commonController.addChat(newMessage);
      
            } catch (error) {
              console.error('Error saving message:', error);
            }
        });
  

        /**
         * Socket Events For Application Logic.
        **/

        socket.on('hello', ()=> {
            gameIo.emit('Hello');
        })

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