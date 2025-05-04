let users = [];

export default function socketHandler(io){
  io.on('connection', (socket) => {

  
    socket.on('new-user-joined', (name) => {
      const newUser = { name, id: socket.id };
      users.push(newUser);
      console.log(users);
      console.log(`${name} joined`);


      
    });

    socket.on('gettargetedid',(data)=>{
 
      var z = users.filter((i)=> i.name=== data.from)
      var targetedid = z[0].id

      if(users.length===0)
      {
        console.log('no such users')
        return
      }
      io.to(targetedid).emit('targetedidforcalling',users)
    })

    //

    socket.on('messagefromuser', (message) => {
      const targetUser = users.find(u => u.name === message.to);
      if (!targetUser) return;

      io.to(targetUser.id).emit('private-msg', {
        from: message.from,
        message: message.message,
        to: targetUser.name
      });
      console.log('msg sent');
    });

    socket.on('privatesendreq', (data) => {
      const targetUser = users.find(u => u.name === data.to);
      if (!targetUser) return;

      io.to(targetUser.id).emit('privatefriendrequest', {
        from: data.from,
        fromId: data.fromId,
        image: data.requesteduserprofile,
        to: targetUser.name,
        toId: data.toId
      });
    });

    socket.on('requestconfirmed', (data) => {
      const targetUser = users.find(u => u.name === data.to);
      if (!targetUser) return;

      io.to(targetUser.id).emit('requestaccepted', {
        from: data.from,
        to: targetUser.name
      });
    });

    socket.on('sendfriendrequest', (data) => {
      const targetUser = users.find(u => u.name === data.to);
      if (!targetUser) return;

      io.to(targetUser.id).emit('friendrequest', {
        from: data.from,
        to: targetUser.name
      });
    });

    socket.on('typing', (data) => {
      const targetUser = users.find(u => u.name === data.to);
      if (!targetUser) return;

      io.to(targetUser.id).emit('sendertyping', {
        from: data.from,
        to: data.to
      });
    });

    socket.on('messagesended', (data) => {
      const targetUser = users.find(u => u.name === data.to);
      if (!targetUser) return;

      io.to(targetUser.id).emit('removetyping', {
        from: data.from,
        to: targetUser.name
      });
    });

    socket.on('stoptyping', (data) => {
      const targetUser = users.find(u => u.name === data.to);
      if (!targetUser) return;

      io.to(targetUser.id).emit('senderstopedtyping', {
        from: data.from,
        to: data.to
      });
    });


    //calling feature


    socket.on('call-user', ({ to, offer }) => {
      io.to(to).emit('incoming-call', { from: socket.id, offer });
    });
  
    socket.on('answer-call', ({ to, answer }) => {
      io.to(to).emit('call-answered', { from: socket.id, answer });
    });
  
    socket.on('ice-candidate', ({ to, candidate }) => {
      io.to(to).emit('ice-candidate', { from: socket.id, candidate });
    });

    socket.on('disconnect', () => {
      const index = users.findIndex(u => u.id === socket.id);
      if (index !== -1) {
        console.log(`${users[index].name} disconnected`);
        users.splice(index, 1);
      }
    });
  });
};
