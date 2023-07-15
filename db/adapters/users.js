const client = require("../client");
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

async function createUser(username, password) {
    try {
        if (!password || password === "") {
            throw new Error("Password field can't be left empty");
        }
        const encrypted = bcrypt.hashSync(password, SALT_COUNT);
        const {rows: [user]} = await client.query(`
            INSERT INTO users(username, password)
            VALUES ($1, $2)
            RETURNING *;
        `, [username, encrypted]);
        return user;
    } catch (error) {
        throw error;
    }
}

async function getUser(username, password) {
    try {
        if (!password || password === "") {
            throw new Error("Can't leave password field empty");
        }
        const {rows: [user]} = await client.query(`
            SELECT * FROM users
            WHERE username=$1;
        `, [username]);
        if (!user) {
            throw new Error("No such user exists");
        }
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            throw new Error("Wrong password!")
        }
        return user;
    } catch (error) {
        throw error;
    }
}

async function getUserById(searchID) {
    try {
        const {rows: [user]} = await client.query(`
            SELECT * FROM users
            WHERE id=$1;
        `, [searchID]);

        let {id, username} = user;
        return {id, username};
    } catch (error) {
        throw error;
    }
}

async function getUserByUsername(searchUsername) {
    try {
        const {rows: [user]} = await client.query(`
            SELECT * FROM users
            WHERE username=$1;
        `, [searchUsername]);
        return user;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByUsername
}