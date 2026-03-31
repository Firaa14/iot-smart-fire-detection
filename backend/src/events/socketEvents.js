export default function(io) {
  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    // Join room
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`📍 User joined room: ${room}`);
    });

    // Device response
    socket.on('device_response', (data) => {
      console.log('📨 Device response:', data);
      io.emit('device_status_update', data);
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });
}