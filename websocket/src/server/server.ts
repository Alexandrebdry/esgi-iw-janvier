import { Server } from "socket.io";
import {MessageType} from "../types/message";

const PORT = 9000;
const io = new Server(PORT, {
    cors: {
        origin: "http://localhost:3000",
    }
});

const messages = [] as MessageType[];

io.on("connection", (socket) => {

    socket.on('join-room', (room) => {
        socket.join(room);
        const allMessages = messages.filter(message => message.roomId === room);
        socket.emit("all-messages", allMessages);
    });

    socket.on("send-message", ({message, room}) => {
        const newMessage: MessageType = {
            ...message,
            readersMessageIds: [],
            roomId: room
        };

        messages.push(newMessage);
        socket.to(room).emit("new-message", message);
        socket.emit("new-message", newMessage);
    });

    socket.on("read-message", ({ messageId, room  }) => {
        const message = messages.find(m => m.id === messageId);
        if (!message) return;

        if (socket.id === message.senderMessageId) return;

        if (!message?.readersMessageIds?.includes(socket.id)) {
            // @ts-ignore
            message.readersMessageIds.push(socket.id);
        }

        socket.to(room).emit("message-updated", message);
        socket.emit('message-updated', message);
    });


});
























