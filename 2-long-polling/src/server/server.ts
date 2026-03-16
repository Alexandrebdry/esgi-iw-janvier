import express from "express";
import { EventEmitter } from "events";
import {JsonDB, Config} from "node-json-db";
import cors from "cors";
import path from "path";
import {generateRandomUser} from "./generateUser";

const PORT = 4000 ;
const eventEmitter = new EventEmitter();
const server = express();

server.use(express.json());
server.use(cors());

const db = new JsonDB(new Config(path.join(__dirname, "users.json"), true, false, "/"));

server.get("/users",  async (req, res) => {
    const listener = async () => {
        try {
            const users = await db.getData('/');
            res.json(users);
            eventEmitter.off("event", listener);
        } catch (error) {
            res.status(500).send("Internal Server Error");
        }
    };

    eventEmitter.on("event",  listener);
    req.on("close", () => {
        eventEmitter.off("event", listener);
    });
});

setInterval(async () => {
    try {
        const users: User[] = await db.getData("/");
        const newUser = generateRandomUser(users.length);
        users.push(newUser);
        await db.push("/", users, true);
        console.log("Utilisateur ajouté :", newUser);
        eventEmitter.emit("event", users);
    } catch (error) {
        console.error("Erreur ajout utilisateur :", error);
    }
}, 5000);

type User = {
    id: number;
    name: string;
    username: string;
    email: string;
}


server.listen(PORT, () => {
    console.log(`🚀 Serveur dispo sur http://localhost:${PORT}`);
});





