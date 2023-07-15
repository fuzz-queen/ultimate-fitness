const express = require('express');
const activitiesRouter = express.Router();

const {
    getAllActivities,
    createActivity,
    getActivityById,
    updateActivity,
} = require('../db/adapters/activities');

const { 
    getAllUsers,
    createUser,
    getUserbyId 
} = require('../db/adapters/users')

const {
    getAllPublicRoutines,
    getPublicRoutinesByActivity
} = require('../db/adapters/routines')

const validateUserFromToken = async (token) => {
    try {
        token = token.slice(7);
        const decodedToken = decode(token);
        const user = await getUserbyId(decodedToken.sub);
        if (user === null) {
            throw new Error("Couldn't authenticate user");
            return user;
        }
    } catch (error) {
        console.error("Error validating user from token: ", error);
        return null;
    }
};

activitiesRouter.get('/', async (req, res) => {
    try {
        const activities = await getAllActivities();
        if (activities === null) {
            throw new Error("Activities has a null value");
        }
        res.send(activities);
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})

activitiesRouter.post('/', async (req, res) => {
    const token = req.headers.authorization;
    const user = await validateUserFromToken(token);
    if (user === null) {
        res.status(401).send({error: "User couldn't be authenticated"});
        return;
    }
    const { name, description } = req.body;
    try {
        const activity = await createActivity({ name, description });
        if (activity === null) {
            throw new Error("Activity has null value");
        }
        res.send(activity);
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})

activitiesRouter.patch('/:activityId', async (req, res) => {
    try {
        const token = req.headers.authorization;
        const user = await validateUserFromToken(token);
        if (user === null) {
            res.status(401).send({error: "Couldn't authenticate user"});
            return;
        }
        const {activityId} = req.params;
        const {name, description} = req.body;
        const activity = await updateActivity(activityId, name, description);
        if (activity === null) {
            throw new Error("The activity is null");
        }
        res.send(activity);
    } catch (error) {
        res.status(500).send({error: error.message});
    }
});

activitiesRouter.patch('/:activityId', async (req, res) => {
    try {
        const token = req.headers.authorization;
        const user = await validateUserFromToken(token);
        if (user === null) {
            res.status(401).send({error: "The user is not authenticated"});
            return;
        }
        const {activityId} = req.params;
        const {name, description} = req.body;
        const activity = await updateActivity(activityId, name, description);
        if (activity === null) {
            throw new Error("Activity has a null value");
        }
        res.send(activity);
    } catch (error) {
        res.status(500).send({error: error.message});
    }
});

activitiesRouter.get(':/activityId/routines', async (req, res) => {
    try {
        const {activityId} = req.params;
        const routines = await getPublicRoutinesByActivity(activityId);
        if (routines === null) {
            throw new Error("Routines has a null value");
        }
        res.send(routines);
    } catch (error) {
        res.status(500).send({error: error.message});
    }
});

module.exports = activitiesRouter;