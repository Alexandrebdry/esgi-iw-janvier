import {io} from 'socket.io-client';
import {MessageType} from "../types/message";

const socket = io("ws://localhost:9000");
socket.on('connection', () => {
    console.log("user connected");
});


let joinedRoomId = "";

const roomContainer = document.getElementById("room-container");
if(roomContainer) {
    roomContainer.style.display = "none";
}

const messageContainer = document.getElementById('messages');
const form = document.getElementById('type-message') as HTMLFormElement;

const btnRoom1 = document.getElementById('room-1') as HTMLButtonElement;
const btnRoom2 = document.getElementById('room-2') as HTMLButtonElement;

btnRoom1?.addEventListener('click', () => {

    if(!joinedRoomId){
        socket.emit('join-room', 'room-1');
        joinedRoomId = 'room-1';
        if(btnRoom2) btnRoom2.disabled = true;
        if(roomContainer) roomContainer.style.display = "block";
        if(btnRoom1) btnRoom1.innerText = "leave room 1";
    }

    else {
        socket.emit('leave-room', 'room-1');
        if(messageContainer) messageContainer.innerHTML = "";
        if(btnRoom2) btnRoom2.disabled = false;
        if(btnRoom1) btnRoom1.innerText = "ROOM 1";
        joinedRoomId = '';
    }

});

btnRoom2?.addEventListener('click', () => {

    if(!joinedRoomId) {
        socket.emit('join-room', 'room-2');
        joinedRoomId = 'room-2';
        if(btnRoom1) btnRoom1.disabled = true;
        if(btnRoom2) btnRoom2.innerText = "leave room 2";
        if(roomContainer) roomContainer.style.display = "block";
        if(messageContainer) messageContainer.innerHTML = "";
    }

    else {
        socket.emit('leave-room', 'room-2');
        if(messageContainer) messageContainer.innerHTML = "";
        if(btnRoom1) btnRoom1.disabled = false;
        if(btnRoom2) btnRoom2.innerText = "ROOM 2";
        joinedRoomId = '';

    }


});

const socketContainer = document.getElementById('socket');

socket.on('connection', () => {
    if(socketContainer) socketContainer.innerText = socket?.id ?? "";
});


form?.addEventListener('submit', (event) => {
    event.preventDefault();

    const text = String(form?.elements['message'].value);
    const message = {
        id : crypto.randomUUID(),
        text,
        senderMessageId: socket.id,
    } as MessageType;

    socket.emit('send-message', {message, room: joinedRoomId});
    form.reset();
});

socket.on("new-message", (message: MessageType) => {
    displayMessage(message);
    if (message.senderMessageId === socket.id) return;
    socket.emit("read-message", { messageId: message.id, room: joinedRoomId });
});
socket.on("message-updated", (message: MessageType) => {
    displayMessage(message);
});


function displayMessage(message: MessageType) {
    if (!messageContainer) return;


    let li = document.getElementById(message.id) as HTMLLIElement | null;

    if (!li) {
        li = document.createElement("li");
        li.id = message.id;
        li.className = "message";

        li.innerHTML = `
            <div class="sender"></div>
            <div class="content"></div>
            <div class="readers"></div>
        `;

        messageContainer.appendChild(li);
    }

    li.querySelector(".sender")!.textContent =
        `Envoyé par : ${message.senderMessageId}`;

    li.querySelector(".content")!.textContent =
        `Contenu : ${message.text}`;

    // @ts-ignore
    const readers = message?.readersMessageIds?.length > 0
            ? message?.readersMessageIds?.join(", ")
            : "Personne";

    li.querySelector(".readers")!.textContent =
        `Lu par : ${readers}`;
}



socket.on("all-messages", (messages: MessageType[]) => {
    messages.forEach((message) => {
        displayMessage(message);

        if (message.senderMessageId !== socket.id) {
            socket.emit("read-message", {
                messageId: message.id,
                room: joinedRoomId
            });
        }
    });
});





