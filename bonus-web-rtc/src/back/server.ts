import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";

const PORT = 4000;
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        // message peut être un Buffer, donc convertir en string
        const msgStr = message.toString();

        // rebroadcast à tous les clients sauf l'émetteur
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === client.OPEN) {
                client.send(msgStr); // envoyer **toujours en string**
            }
        });
    });
});


server.listen(PORT, () => console.log("✅ Signaling server on :" + PORT));
