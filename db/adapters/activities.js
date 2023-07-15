const client = require("../client");

function structureObjectFromResultSet(result) {
    const objectArray = [];
    result.forEach((row) => {
        const object = {};
        for (const column in row) {
            object[column] = row[column];
        }
        objectArray.push(object);
    });
    return objectArray;
}

async function updateActivity(activityId, name, description) {
    try {
        const {rows: [activity]} = await client.query(`
            UPDATE activites
            SET name=$1, description=$2
            WHERE id=${activityId}
            RETURNING *;
        `, [name, description]);
    } catch (error) {
        throw error;
    }
}

async function getActivityById(activityId) {
    try {
        const {rows: [activity]} = await client.query(`
            SELECT * FROM activites
            WHERE id=${activityId};
        `);
        return activity;
    } catch (error) {
        throw error;
    }
}

async function getAllActivities() {
    try {
        const {rows: activityArray} = await client.query(`
            SELECT * FROM activities;
        `);
        return activityArray;
    } catch (error) {
        throw error;
    }
}

async function createActivity({name, description}) {
    try {
        const {rows: [activity]} = await client.query(`
            INSERT INTO activities(name, description)
            VALUES($1, $2)
            RETURNING *
        `, [name, description]);
        return activity;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createActivity,
    getActivityById,
    getAllActivities,
    updateActivity
}