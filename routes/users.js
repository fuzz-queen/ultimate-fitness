const express = require('express');
const usersRouter = express.Router();

const {encode, decode} = require('../jwt');

const {
    createUser,
    getUser,
    getUserById,
    getUserByUsername
} = require('../db/adapters/users');

const {
    getRoutinesWithoutActivities,
    getRoutineById,
    getAllRoutines,
    getAllPublicRoutines,
    getAllRoutinesByUser,
    getPublicRoutinesByUser
} = require('../db/adapters/routines');

const authenticateAndGetUser = async (username, password) => {
    try {
        const user = await getUser(username, password);
        if (user === null || !user['username']) {
            throw new Error("couldn't authenticate user");
        }
        const sub = user.id;
        const userNameFromDB = user.username;
        const iat = Date.now();
        const exp = iat + (1000 * 60 * 60 * 24 * 7);
        const payload = {sub, name: userNameFromDB, iat, exp};
        const token = encode(payload);
        const message = "Thanks for logging in!";
        const {id} = user;
        return {token, message, user: {id, username: userNameFromDB} };
    } catch (error) {
        throw error;
    }
}

usersRouter.get('/', async (req, res) => {
    try {
        res.status(404).send("The /users route is not supported");
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})

usersRouter.post('/login', async (req, res) => {
    try {
        const responseObj = await authenticateAndGetUser(req.body.username, req.body.password);
        if (responseObj === null) {
            res.status(401).send("The user is nto authenticated");
        } else {
            res.send(JSON.stringify(responseObj));
        }
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})

usersRouter.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await createUser(username, password);
        if (user === null) {
            throw new Error("couldn't create user");
        }
        const responseObj = await authenticateAndGetUser(username, password);
        if (responseObj === null || !responseObj.token || !responseObj.message) {
            throw new Error("Couln't authenticate user");
        }
        responseObj.message = "Thanks for signing up!";
        return res.send(JSON.stringify(responseObj));
    } catch (error) {
        if (error.message.startsWith("duplicate key value violates unique constraint")) {
            const msg = "Username already exists"
            res.status(400).send({error: msg});
        } else {
            res.status(500).send({error: error.message});
        }
        
    }
});

usersRouter.get('/:username/routines', async (req, res) => {
    try {
        const {username} = req.params;
        const requestedUser = await getUserByUsername(username);
        if (requestedUser === null || requestedUser.id === null) {
            res.status(404).send("Nothing to see here");
            return;
        }
        
        let privateAccessAllowed = false;
        let token = req.headers['authorization'];
        if (token) {
            token = token.slice(7, token.length);
            console.log("token: ", token);
            const decodedToken = decode(token)
            const {sub} = decodedToken;
            if (sub === reequestedUser.id) {
                privateAccessAllowed = true;
            }
        }
        if (privateAccessAllowed) {
            const routines = await getAllRoutinesByUser(username);
            res.send(routines);
        } else {
            const routines = await getPublicRoutinesByUser(username);
            res.send(routines);
        }
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})

usersRouter.get('/me', async (req, res) => {
    try {
        let token = req.headers['authorization'];
        if (token) {
            token = token.slice(7, token.length);
            const decodedToken = decode(token)
            const {sub} = decodedToken;
            const user = await getUserById(sub);
            if (user === null) {
                res.status(404).send("User doesn't exist");
                return;
            }
            delete user.password;
            res.send(user);
        } else {
            res.status(401).send("You're not authorized to see this")
        }
    } catch (error) {
        res.status(500).send({error: error.message});
    }
});

module.exports = usersRouter;