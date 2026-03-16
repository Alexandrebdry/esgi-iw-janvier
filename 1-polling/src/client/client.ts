

type User = {
    id: number;
    name: string;
    username: string;
    email: string;
}

let users: User[] = [];

const fetchUsers = async () => {
    try {
        const response  = await fetch("http://localhost:4000/users");
        const newUsers = await response.json();

        const uniqueUsers = newUsers.filter(user =>
            !users.some(u => u.id === user.id)
        );

        if (uniqueUsers.length > 0) {
            users.push(...uniqueUsers);
            displayUser(uniqueUsers);
        }
    } catch (error) {
        console.error(error);
    }

}

const displayUser =  (users: User[]) => {

    const list = document.getElementById("users");
    users.map(user => {
        const userLi = document.createElement("li");
        userLi.appendChild(document.createTextNode(`id: ${user.id}, username: ${user.username}, name: ${user.name}`));
        list?.appendChild(userLi);
    });

}

const EACH_SECOND = 1000;
fetchUsers();
setInterval(fetchUsers, EACH_SECOND);






