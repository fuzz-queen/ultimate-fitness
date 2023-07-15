const client = require("../client");

async function createRoutineActivity({routine_id, activity_id, duration, count}) {
    try {
        const {rows: [routine_activity]} = await client.query(`
            INSERT INTO routine_activities(routine_id, activity_id, duration, count)
            VALUES($1, $2, $3, $4)
            RETURNING *;
        `, [routine_id, activity_id, duration, count]);
        return routine_activity;
    } catch (error) {
        throw error;
    }
}

async function destroyRoutineActivity(routineActivityId) {
    try {
        const {rows: [routine_activity]} = await client.query(`
            DELETE FROM routine_activities
            WHERE id=$1
            RETURNING *;
        `, [routineActivityId]);
        return routine_activity;
    } catch (error) {
        throw error;
    }
}

async function getRoutineActivitiesByRoutine(routineId) {
    try {
        const {rows: routine_activities} = await client.query(`
        SELECT * FROM routine_activities
        WHERE routine_id=$1;
        `, [routineId]);
        return routine_activities;
    } catch (error) {
        throw error;
    }
}

async function getRoutineActivityById(routineActivityId) {
    try {
        const {rows: [routine_activity]} = await client.query(`
            SELECT * FROM routine_activities
            WHERE id=$1;
        `, [routineActivityId]);
        return routine_activity;
    } catch (error) {
        throw error;
    }
}

async function addActivityToRoutine(routineId, activityId, count, duration) {
    try {
        const {rows: [routine_activity]} = await client.query(`
            INSERT INTO routine_activities(routine_id, activity_id, count, duration)
            VALUES($1, $2, $3, $4)
            RETURNING *;
        `, [routineId, activityId, count, duration]);
        return routine_activity;
    } catch (error) {
        throw error;
    }
}

async function updateRoutineActivity(routineActivityId, count, duration) {
    try {
        const {rows: [routine_activity]} = await client.query(`
            UPDATE routine_activities
            SET count=$1, duration=$2
            WHERE id=$3
            RETURNING *;
        `, [count, duration, routineActivityId]);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createRoutineActivity,
    destroyRoutineActivity,
    getRoutineActivitiesByRoutine,
    getRoutineActivityById,
    addActivityToRoutine,
    updateRoutineActivity
}