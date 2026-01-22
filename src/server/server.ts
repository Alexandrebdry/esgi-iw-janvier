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

    socket.emit('connection');

    socket.on("send-message", (message: MessageType) => {
        const newMessage: MessageType = {
            ...message,
            readersMessageIds: []
        };

        messages.push(newMessage);
        socket.broadcast.emit("new-message", message);
    });

    socket.on("read-message", ({ messageId,  }) => {
        const message = messages.find(m => m.id === messageId);
        if (!message) return;

        if (socket.id === message.senderMessageId) return;

        if (!message?.readersMessageIds?.includes(socket.id)) {
            // @ts-ignore
            message.readersMessageIds.push(socket.id);
        }

        socket.broadcast.emit("message-updated", message);
        socket.emit("message-updated", message);
    });


});
























