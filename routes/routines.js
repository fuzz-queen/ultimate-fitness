const express = require('express');
const routinesRouter = express.Router();

const {
    createRoutine,
    getRoutineById,
    getAllRoutines,
    getAllPublicRoutines,
    getAllRoutinesByUsers,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    updateRoutine,
    destroyRoutine,
} = require('../db/adapters/routines');

const {getUserById} = require('../db/adapters/users');
const {addActivityToRoutine} = require('../db/adapters/routine_activities');
const {encode, decode} = require('../jwt');
const routinesAdapter = require('../db/adapters/routines');
const { create } = require('domain');

routinesRouter.get('/', async (req, res) => {
    try {
        console.log("routines root route, before before calling routines adapter");
        console.log("routinesAdapter.getAllPublicRoutines: ", routinesAdapter.getAllPublicRoutines);
        const routines = await routinesAdapter.getAllPublicRoutines();
        res.send(JSON.stringify(routines));
    } catch (error) {
        res.status(500).send({error: error.message});
    }
});

routinesRouter.post('/', async (req, res) => {
    try {
        console.log("req.headers: ", req.headers);
        let token = req.headers.authorization;
        console.log("token: ", token);
        if (token) {
            token = token.slice(7, token.length);
            const decodedToken = decode(token)
            const {sub} = decodedToken;
            if (sub === null || sub === undefined || sub === "") {
                res.status(401).send("You can't access this resource because there's no sub");
                return;
            }
            let user = await getUserById(sub);
            if (user === null) {
                res.status(404).send("We couldn't find anything");
                return;
            }
            try {
                const routineObj = {
                    creator_id: user.id,
                    is_public: req.body.isPublic,
                    name: req.body.name,
                    goal: req.body.goal
                }
                const routine = await createRoutine(routineObj);
                if (routine === null) {
                    throw new Error("Error creating routine");
                    return;
                }
                res.send(routine);
            } catch (error) {
                res.status(500).send({error: error.message});
            }
            res.send(user);
        }
    } catch (error) {
        res.status(401).send("CATCH - You don't have clearence to access this");
    }
});

const checkAuth = async (req, res, next) => {
    let token = req.headers.authorization;
    console.log("token: ", token);
    if (token) {
        token = token.slice(7, token.length);
        const decodedToken = decode(token)
        const {sub} = decodedToken;
        if (sub === null || sub === undefined || sub === "") {
            res.status(401).send("You don't have authorization to access this");
            return;
        }
        let user = await getUserById(sub);
        if (user === null) {
            res.status(404).send("Couldn't find anything");
            return;
        }
    } else {
        res.status(401).send("You don't have authorization to access this");
    }
}

routinesRouter.patch('/:routineId', async (req, res) => {
    let token = req.headers.authorization;
    console.log("token: ", token);
    if (token) {
        let routine = null;
        token = token.slice(7, token.length);
        const decodedToken = decode(token)
        const {sub } = decodedToken;
        if (sub === null || sub === undefined || sub === "") {
            res.status(401).send("There's no sub. You don't have authorization to access this")
            return;
        }
        let user = await getUserById(sub);
        if (user === null) {
            res.status(404).send("Couldn't find anything")
            return;
        }
        const routineId = req.params.routineId;
        try {
            routine = await getRoutineById(routineId);
            if (routine === null) {
                throw new Error("Error retrieving routine: has no value");
                return;
            }
            console.log("user.id: ", user.id);
            console.log("routine: ", routine);
            console.log("PATCH routine.creator_id: ", routine[0].creator_id);
            const routineCreatorId = routine[0].creator_id;
            if (routineCreatorId !== user.id) {
                res.status(401).send("You don't have authorization to update this routine");
                return;
            }
        } catch (error) {
            console.log("error: ", error);
            res.status(500).send({error: error.message});
        }
        const requestRoutineObj = req.body;
        try {
            if (routine === null) {
                throw new Error("Couldn't update routine, it's null");
                return;
            }
            res.send(routine);
        } catch (error) {
            res.status(500).send({error: error.message});
        }
    }
});

routinesRouter.delete('/:routineId', async (req, res) => {
    let token = req.headers.authorization;
    console.log("token: ", token)
    if (token) {}
})

module.exports = routinesRouter