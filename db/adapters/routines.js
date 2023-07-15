const { client } = require("../client");

const {getUserByUsername} = require('./users');
const {
    destroyRoutineActivity,
    getRoutineActivityById,
    getRoutineActivitiesByRoutine
} = require('./routine_activities')

async function structureObjectFromResultSet(result) {
    const objectArray = [];
    let currentRoutineObject = {};
    result.forEach((row) => {
        if (row.id !== currentRoutineObject.id) {
            if (Object.keys(currentRoutineObject).length !== 0) {
                objectArray.push(currentRoutineObject);
            }

            currentRoutineObject = {
                id: row.id,
                creatorId: row.creator_id,
                creatorName: row.username,
                isPublic: row.is_public,
                name: row.name,
                goal: row.goal,
                activity: []
            };
        }

        currentRoutineObject.activity.push({
            id: row.activity_id,
            name: row.activity_name,
            description: row.description,
            duration: row.duration,
            count: row.count,
            routineActivityId: row.routineActivityId,
            routineId: row.id
        });
    })
    objectArray.push(currentRoutineObject);
    return objectArray;
}

async function getRoutineById(id) {
    try {
        const {rows: routines} = await client.query(`
        SELECT r.id, r.creator_id, r.is_public, r.name, r.goal,
        ra.id as routineActivityId, ra.duration, ra.count,
        a.id AS activity_id, a.name AS activity_name, a.description
        FROM routines r
        LEFT JOIN routine_activities ra ON r.ID = ra.routine_id
        LEFT JOIN activities a ON ra.activity_id = a.ID
        WHERE r.id = $1;
        `, [id]);
        return routines;
    } catch (error) {
        console.log("getRoutineById query error: ", error);
        throw error;
    }
}

async function getRoutinesWithoutActivities() {
    try {
        const {rows: routines} = await client.query(`
            SELECT * FROM routines;
        `)
        return routines;
    } catch (error) {
        throw error;
    }
}

async function getAllRoutines() {
    try {
        const {rows: routines} = await client.query(`
            SELECT r.id, r.creator_id, u.username, r.is_public, r.name, r.goal,
            ra.id as routineActivityId, ra.duation, ra.count,
            a.id AS activity_id, a.name AS activity_name, a.description
            FROM routines r
            JOIN users u ON r.creator_id = uid
            LEFT JOIN routine_activities ra ON r.id = ra.routine_id
            LEFT JOIN activities a ON ra.activity_id = a.id
            ORDER BY r.id;
        `);
        const resultArray = structureObjectFromResultSet(routines);
        return resultArray;
    } catch (error) {
        throw error;
    }
}

async function getAllPublicRoutines() {
    try {
        const {rows: routines} = await client.query(`
            SELECT r.id, r.creator_id, u.username, r.is_public, r.name, r.goal,
            ra.id as routineActivityId, ra.duration, ra.count,
            a.id AS activity_id, a.name AS activity_name, a.description
            FROM routines r
            JOIN users u ON r.creator_id = u.id
            LEFT JOIN routine_activities ra ON r.id = ra.routine_id
            LEFT JOIN activites a ON ra.activity_id = a.id
            WHERE r.is_public = true
            ORDER BY r.id;
        `)
        const resultArray = structureObjectFromResultSet(routines);
        return resultArray;    
    } catch (error) {
        throw error;
    }
}

async function getAllRoutinesByUser(username) {
    try {
        const {id} = await getUserByUsername(username);
        const {rows: routines} = await client.query(`
            SELECT r.id, r.creator_id, u.username,, r.is_public, r.name, r.goal,
            ra.id as routineActivityId, ra.duration, ra.count,
            a.id AS activity_id, a.name AS activity_name, a.description
            FROM routines r
            JOIN users u ON r.creator_id = u.id
            LEFT JOIN routine_activities ra ON r.id = ra.routine_id
            LEFT JOIN activities a ON ra.activity_id = a.id
            WHERE r.creator_id = $1
            ORDER BY r.id;
        `, [id]);
        const resultArray = structureObjectFromResultSet(routines);
        return resultArray;
    } catch (error) {
        throw error;
    }
}

async function getPublicRoutinesByUser(username) {
    try {
        const {id} = await getUserByUsername(username);
        const {rows: routines} = await client.query(`
            SELECT r.id, r.creator_id, u.username, r.is_public, r.name, r.goal,
            ra.id as routineActivityId, ra.duration, ra.count,
            a.id AS activity_id, a.name AS activity_name, a.description
            FROM routines r
            JOIN users u ON r.creator_id = u.id
            LEFT JOIN routine_activities ra ON r.id = ra.routine_id
            LEFT JOIN activities a ON ra.activity_id = a.id
            WHERE r.creator_id = $1 AND r.is_public = true
            ORDER BY r.id;
        `, [id]);
        const resultArray = structureObjectFromResultSet(routines);
        return resultArray;
    } catch (error) {
        throw error;
    }
}

async function getPublicRoutinesByActivity(activityId) {
    try {
        const {rows: routines} = await client.query(`
            SELECT r.id, r.creator_id, u.username, r.is_public, r.name, r.goal,
            ra.id as routineActivityId, ra.duration, ra.count,
            a.id AS activity_id, a.name AS activity_name, a.description
            FROM routines r
            JOIN users u ON r.creator_id = u.id
            LEFT JOIN routine_activities ra ON r.id = ra.routine_id
            LEFT JOIN activities a ON ra.activity_id = a.id
            WHERE r.is_public = true AND a.id = $1
            ORDER BY r.id
        `, [activityId]);
        
        const resultArray = structureObjectFromResultSet(routines);
        return resultArray;
    } catch (error) {
        throw error;
    }
}

async function createRoutine({creator_id, is_public, name, goal}) {
    is_public = is_public ? is_public.toString().toLowerCase() : 'false';
    is_public = (is_public === 'true') ? 'true' : 'false';
    try {
        const {rows: [routine]} = await client.query(`
            INSERT INTO routines(creator_id, is_public, name, goal)
            VALUES($1, ${is_public}, $2, $3)
            RETURNING *;
        `, [creator_id, name, goal]);
        return routine;
    } catch (error) {
        throw error;
    }
}

async function updateRoutine(routineId, isPublic, name, goal) {
    const currentRoutine = await getRoutineById(routineId);
    if (!currentRoutine) {
        throw Error("no such routine found")
    }
    isPublic = isPublic ? isPublic.toString().toLowerCase() : 'false';
    isPublic = (isPublic === 'true') ? 'true' : 'false';
    try {
        const {rows: [routine]} = await client.query(`
            UPDATE routines
            SET is_public = ${isPublic}, name = $2, goal = $3
            WHERE id = $1
            RETURNING *;
        `, [routineId, name, goal]);
        return routine;
    } catch (error) {
        throw error;
    }
}

async function destroyRoutine(routineId) {
    try {
        const routineActivities = await getRoutineActivitiesByRoutine(routineId);
        if (Array.isArray(routineActivities) && routineActivities.length > 0) {
            routineActivities.forEach(async (routineActivity) => {
                routineActivities.forEach(async (routineActivity) => {
                    await destroyRoutineActivity(routineActivity.id);
                })
            })
        }
        const {rows: [routine]} = await client.query(`
            DELETE FROM routines
            WHERE id = $1
            RETURNING *;
        `, [routineId]);
        return routine;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getRoutinesWithoutActivities,
    getRoutineById,
    getAllRoutines,
    getAllPublicRoutines,
    getAllRoutinesByUser,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    createRoutine,
    updateRoutine,
    destroyRoutine
}