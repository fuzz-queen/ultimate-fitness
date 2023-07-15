const express = require('express');
const routineActivitiesRouter = express.Router();
const {decode} = require('../jwt');
const {getUserById} = require('../db/adapters/users');
const {getRoutineById} = require('../db/adapters/routines');

const {
    updateRoutineActivity,
    getRoutineActivityById,
    destroyRoutineActivity
} = require('../db/adapters/routine_activities');

const validateUserFromToken = async (token) => {
    try {
        token = token.slice(7);
        const decodedToken = decode(token);
        const user = await getUserById(decodedToken.sub);
        if (user === null) {
            throw new Error("The user is not authenticated");
        }
        return user;
    } catch (error) {
        console.error("Error validating user from token: ", error);
        return null;
    }
};

routineActivitiesRouter.patch('/:routineActivityId', async (req, res) => {
    const token = req.headers.authorization;
    try {
        const user = await validateUserFromToken(token);
        console.log("ra patch, user: ", user);
        if (user === null) {
            res.status(401).send({error: "Couldn't authenticate user"});
            return;
        }
        const {routineActivityId} = req.params;
        const {count, duration} = req.body;
        const routineActivity = await getRoutineActivityById(routineActivityId);
        console.log("routineActivity: ", routineActivity);
        const routines = await getRoutineById(routineActivity.routine_id);
        console.log("routine: ", routines);
        if (routines[0].creator_id !== user.id) {
            res.status(403).send({error: "The user doesn't have this routine"});
            return;
        }

        const updatedRoutineActivity = await updateRoutineActivity(routineActivityId, count, duration);
        res.status(200).send(updatedRoutineActivity);
    } catch (error) {
        res.status(500).send({error: error.message});
    }
});

routineActivitiesRouter.delete('/:routineActivityId', async (req, res) => {
    const token = req.headers.authorization;
    try {
        const user = await validateUserFromToken(token);
        if (user === null) {
            res.status(401).send({error: "Couldn't authenticate that user"});
            return;
        }
        const {routineActivityId} = req.params;
        const routineActivity = await getRoutineActivityById(routineActivityId);
        const routines = await getRoutineById(routineActivity.routine_id);
        if (routines[0].creator_id !== user.id) {
            res.status(403).send({error: "User doesn't own this routine"});
            return;
        }

        await destroyRoutineActivity(routineActivityId);
        res.status(200).send(routineActivity);
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})

module.exports = routineActivitiesRouter;