import { Server } from "socket.io";

const PORT = 9000;
const io = new Server(PORT, {
    cors: {
        origin: "http://localhost:3000",
    }
});

io.on("connection", (socket) => {
    console.log(`user connected: ${socket.id}`);
    socket.emit('connection');
});


















