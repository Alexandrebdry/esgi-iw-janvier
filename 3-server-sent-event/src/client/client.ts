type User = {
    id: number; name: string; email: string; username: string;
}

const users: User[] = [];
const eventSource = new EventSource("http://localhost:4000");

eventSource.addEventListener("open", () => {
    console.log('Connexion ouvert avec le serveur');
});

eventSource.addEventListener("error", (error) => {
    console.error("Une erreur est survenue");
    console.error(error);
});

eventSource.addEventListener("getUsers", event => {

    const eventUsers = JSON.parse(event.data) as User[];
    const uniqueUsers: User[] = eventUsers.filter(user =>
        !users.some(u => u.id === user.id)
    );

    if(uniqueUsers.length > 0) {
        users.push(...uniqueUsers);
        const container = document.getElementById('users');
        if(!container) return;

        uniqueUsers.map(user => {
            const li = document.createElement('li');
            li.textContent = user.name;
            container.appendChild(li);
        });
    }
});