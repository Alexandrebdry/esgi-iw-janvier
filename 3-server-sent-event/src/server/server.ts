import http from "http";
import path from "path";
import {Config, JsonDB} from "node-json-db";

const PORT = 4000;
type User = {
    id: number; name: string; email: string; username: string;
}

const db = new JsonDB(new Config(path.join(__dirname, "users.json"), true, false, "/"));
const getUsers = async () => {
    try {
        const users = await db.getData("/");
        return users as User[];
    } catch (e) {

    }
};

const postUser = async () => {

    const users = await getUsers();
    console.log(users);
    if (!users) return [];

    const id = users?.length + 1;
    const newUser = {
        id: id, name: `user-${id}`, username: `username-${id}`, email: `$user${id}@gmail.com`,
    }
    users.push(newUser);
    await db.push("/",users , true);
};

const server = http.createServer(async (request, response) => {
    response.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache"
    });

    let id = 0;
    setInterval(async () => {
        await postUser();
        const users = await getUsers();
        response.write(`event: getUsers\n`);
        response.write(`id: ${id}\n`);
        response.write(`data: ${JSON.stringify(users)}\n\n`);
        id++;
    }, 5000);
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Serveur dispo sur http://localhost:${PORT}`);
});


