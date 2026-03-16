const randomString = (length: number): string => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const generateRandomUser = (usersLength: number) => {
    const id = usersLength + 1;
    const name = randomString(8);
    const username = randomString(6);
    const email = randomString(5) + "@example.com";

    return { id, name, username, email };
};