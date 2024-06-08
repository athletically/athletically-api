const mongoose = require('mongoose');
const activeUsersCount = new Map(); // Map to track active users count per group


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

                const currentCount = activeUsersCount.get(groupId) || 0;
                activeUsersCount.set(groupId, currentCount + 1);
        
                // Broadcast to the group that a new member has joined
                socket.to(groupId).emit('memberJoined', { userId, groupId, currentActiveUserCount: activeUsersCount.get(groupId) });
        
                // Optionally, you can fetch user details from the database to include in the broadcast
                // const user = await commonController.getUserById(userId);
                // if (user) {
                //     socket.to(groupId).emit('memberJoined', { user, groupId });
                // }
        
                console.log(`User ${userId} joined group ${groupId}`);
            } catch (error) {
                console.error('Error joining group:', error);
            }
        });

        socket.on('sendMessage', async (messageData) => {
            try {
                // console.log(messageData);
              const { group_id, sender_id, message_content, message_file_path, reply_to } = messageData;
              const newMessage = {
                group_id: mongoose.Types.ObjectId(group_id),
                sender_id: mongoose.Types.ObjectId(sender_id),
                message_content,
                message_file_path,
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

        // Listen for typing event
        socket.on('typing', (groupId) => {
            const userId = socket.user.user_id;
            const username = socket.user.name;
            socket.to(groupId).emit('userTyping', {
            userId,
            username,
            groupId
            });
        });
    
        // Listen for stopTyping event
        socket.on('stopTyping', (groupId) => {
            const userId = socket.user.user_id;
            const username = socket.user.name;
            socket.to(groupId).emit('userStoppedTyping', {
            userId,
            username,
            groupId
            });
        });

        // Listen for a leaveGroup event
        socket.on('leaveGroup', async (groupId) => {
            try {
                const userId = socket.user.user_id;
        
                // Leave the group room
                socket.leave(groupId);
        
                // Update the active users count for the group
                const currentCount = activeUsersCount.get(groupId) || 0;
                if (currentCount > 0) {
                    activeUsersCount.set(groupId, currentCount - 1);
                }
        
                // Emit the memberLeft event with the current active user count
                socket.to(groupId).emit('memberLeft', {
                    userId,
                    groupId,
                    currentActiveUserCount: activeUsersCount.get(groupId)
                });
    
                console.log(`User ${userId} left group ${groupId}`);
            } catch (error) {
                console.error('Error leaving group:', error);
            }
        });

        /**
         * Disconnection Handler.
        **/
        socket.on('disconnect',async () => {

            const userId = socket.user.user_id;
            // Update the active users count for all groups the user is in
            const groups = await commonController.getUserGroups(userId); // Assume a function that fetches user groups
            groups.forEach(groupId => {
                const currentCount = activeUsersCount.get(groupId) || 0;
                if (currentCount > 0) {
                    activeUsersCount.set(groupId, currentCount - 1);
                }
            });
            console.log(`one socket disconnected:${socket.id} with user_id:${socket.user.user_id}`);
        });
    });
}

module.exports = {
    setNSP:setNSP
}