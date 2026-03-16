import {Config, JsonDB} from "node-json-db";
import path from "path";

export type User = {
    id: number; name: string; email: string; username: string;
}

const db = new JsonDB(new Config(path.join(__dirname, "users.json"), true, false, "/"));
export const getUsers = async () => {
    try {
        const users = await db.getData("/");
        return users as User[];
    } catch (e) {

    }
};
