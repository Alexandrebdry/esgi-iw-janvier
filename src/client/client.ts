import {io} from 'socket.io-client';
import {MessageType} from "../types/message";

const socket = io("ws://localhost:9000");
socket.on('connection', () => {
    console.log("user connected");
});

const messageContainer = document.getElementById('messages');
const form = document.getElementById('type-message') as HTMLFormElement;

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

    socket.emit('send-message', message);
    form.reset();
});

socket.on("new-message", (message: MessageType) => {
    displayMessage(message);
    if (message.senderMessageId === socket.id) return;
    socket.emit("read-message", { messageId: message.id });
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










