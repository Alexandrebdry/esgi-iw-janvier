import express from "express";
import {JsonDB, Config} from "node-json-db";
import path from "path";
import cors from "cors";
import {generateRandomUser} from "./generateUser";

const app = express();
const PORT = 4000;

const db = new JsonDB(new Config(path.join(__dirname, "users.json"), true, false, "/"));

app.use(express.json());
app.use(cors());

app.get("/users", async (req, res) => {
    try {
        const users: User[] = await db.getData("/");
        console.log(users);
        res.json(users);
    } catch (error) {
        res.status(500).json({error: "Erreur lecture DB"});
    }
});

setInterval(async () => {
    try {
        const users: User[] = await db.getData("/");
        const newUser = generateRandomUser(users.length);
        users.push(newUser);
        await db.push("/", users, true);
        console.log("Utilisateur ajouté :", newUser);
    } catch (error) {
        console.error("Erreur ajout utilisateur :", error);
    }
}, 5000);

app.listen(PORT, () => {
    console.log(`🚀 Serveur dispo sur http://localhost:${PORT}`);
});

type User = {
    id: number;
    name: string;
    username: string;
    email: string;
}
