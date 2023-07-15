const {use} = require('bcrypt/promises');
const {client} = require("./client");

const {
  createUser,
  getUser,
  getUserById,
  getUserByUsername
} = require('./adapters/users');

const {
  getRoutinesWithoutActivities,
  getRoutineById,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine
} = require('./adapters/routines');

const {
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivity
} = require('./adapters/activities');

const {
  createRoutineActivity,
  addActivityToRoutine,
  updateRoutineActivity
} = require('./adapters/routine_activities')

const {
  getSeedUsers,
  getSeedActivities,
  getSeedRoutines,
  getSeedRoutineActivities,
} = require("./seedData");
const e = require('cors');

async function dropTables() {
  try {
    await client.query(`
    DROP TABLE IF EXISTS routine_activities;
    DROP TABLE IF EXISTS activities;
    DROP TABLE IF EXISTS routines;
    DROP TABLE IF EXISTS users;
    `);
    console.log("Tables dropped!")
  } catch (error) {
    console.error("Error dropping tables:");
    throw error;
  }
};

async function createTables() {
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );

      CREATE TABLE routines (
        id SERIAL PRIMARY KEY,
        creator_id INTEGER REFERENCES users(id),
        is_public BOOLEAN DEFAULT false,
        name VARCHAR(255) UNIQUE NOT NULL,
        goal TEXT NOT NULL

      );
      CREATE TABLE activities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL
      );
      CREATE TABLE routine_activities (
        id SERIAL PRIMARY KEY,
        routine_id INTEGER REFERENCES routines(id),
        activity_id INTEGER PREFERENCES activities(id),
        duration INTEGER,
        count INTEGER,
        UNIQUE (routine_id, activity_id)
      );
    `);
    console.log("Tables were successfully built!")
  } catch (error) {
    console.error("Error creating tables:");
    throw error;
  }
}

async function createInitialUsers() {
  const userList = getSeedUsers;
  try {
    userList.forEach(async ({username, password}) => {
      await createUser(username, password);
    });
    console.log("Initial users created!")
  } catch (error) {
    console.error("Had a problem creating users: ", error);
    throw error;
  }
}

async function createInitialActivities() {
  const activityList = getSeedActivities();
  try {
    activityList.forEach(async (activity) => {
      await createActivity(activity);
    });
    console.log("Initial activities created!");
  } catch (error) {
    console.error("Had a problem creating activities:", error);
    throw error;
  }
}

async function createInitialRoutines() {
  const routineList = getSeedRoutines();
  try {
    routineList.forEach(async (routine) => {
      await createRoutine(routine);
    });
    console.log("Initial routines created!");
  } catch (error) {
    console.log("Had a problem creating routines: ", error);
    throw error;
  }
}

async function createInitialRoutineActivities() {
  const routineList = getSeedRoutineActivities();
  try {
    routineList.forEach(async (routineActivity) => {
      await createRoutineActivity(routineActivity);
    });
    console.log("Initial routine activities created!");
  } catch (error) {
    console.log("Had a problem creating routine activities: ", error);
    throw error;
  }
}



async function rebuildDb() {
  client.connect();
  try {
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialActivities();
    await createInitialRoutineActivities();
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.end();
  }
}

async function testDB() {
  await testUserAdapters();
  await testRoutineAdapters();
}

async function testUserAdapters() {
  const user = await getUser('relativity.guy@physics.org', 'e=mc^2');
  if (user && user.id === 1) {
    console.log('getUser is working');
  } else {
    console.error('The getUser function is a malfunction');
  }
  const userById = await getUserById.id(1);
  if (userById && userById.id === 1) {
    console.log('function getUserById is functioning')
  } else {
    console.error('function getUserById? More like malfunction');
  }
  const userByUsername = await getUserByUsername("relativity.guy@physics.org");
  if (userByUsername && userByUsername.username === "relativity.guy@physics.org") {
    console.log('getUserByUsername function is functioning');
  } else {
    console.error('function getUserByUsername? More like malfunction!');
  }
};

async function testRoutineAdapters() {
  const routineById = await getRoutineById(1);
  if (routineById && Array.isArray(routineById) && routineById.length === 3) {
    console.log('getRoutineById function is functioning');
  } else {
    console.error('function getRoutineById? More like malfunction!')
  }

  const routines = await getRoutinesWithoutActivities();
  if (routines && routines.length === 4) {
    console.log('function getRoutinesWithoutActivities is functioning')
  } else {
    console.error('function getRoutinesWithoutActivities? More like malfunction!')
  }

  const allRoutines = await getAllRoutines();
  if (allRoutines && Array.isArray(allRoutines) && allRoutines.length === 4) {
    console.log('function getAllRoutines is functioning indeed')
  } else {
    console.error('getAllRoutines function? More like malfunction!')
  }

  const allPublicRoutines = await getAllPublicRoutines();
  if (allPublicRoutines && Array.isArray(allPublicRoutines)) {
    console.log('function getAllPublicRoutines is functioning, and there are ', allPublicRoutines.length);
  } else {
    console.error('getAllPublicRoutines function? More like malfunction!');
  }

  const allRoutinesByUser = await getAllRoutinesByUser("spiderman@marvel.com");
  if (allRoutinesByUser && Array.isArray(allRoutinesByUser) && allRoutinesByUser.length === 1) {
    console.log('getAllRoutinesByUser function is functioning');
  } else (
    console.error('getAllRoutinesByUser function? More like malfunction!')
  )

  const publicRoutinesByUser = await getPublicRoutinesByUser("spiderman@marvel.com");
  if (publicRoutinesByUser && Array.isArray(publicRoutinesByUser) && publicRoutinesByUser.length === 1) {
    console.log('getPublicRoutinesByUser function is functioning');
  } else {
    console.error('getPublicRoutinesByUser function? More like malfunction!');
  }

  const publicRoutinesByActivity = await getPublicRoutinesByActivity(5);
  if (publicRoutinesByActivity && Array.isArray(publicRoutinesByActivity) && publicRoutinesByActivity.length === 1) {
    console.log('getPublicRoutinesByActivity function in functioning')
  } else {
    console.error('getPublicRoutinesByActivity function? More like malfunction!')
  }

  const updatedRoutine = await updateRoutine(1, false, "weakness training", "get stronger");
  if (updatedRoutine) {
    console.log('updateRoutine function is functioning')
  } else {
    console.error('updateRoutine function? More like malfunction!')
  }

  const activityById = await getActivityById(2);
  if (activityById && activityById.id === 2) {
    console.log('activity retreived by id=1: ', activityById.name);
    console.log('function is functioning')
  } else {
    console.error('getActivityById function? more like malfunction!');
  }

  const allActivities = await getAllActivities();
  if (allActivities && allActivities.length === 8) {
    console.log('getAllActivites function is functioning');
  } else {
    console.error('getAllActivites function? More like malfunction!')
  }

  const updatedActivity = await updateActivity(2, "running", "run around");
  if (updatedActivity && updatedActivity.name === "running") {
    console.log('updateActivity function is functioning');
  } else {
    console.error('updateActivity function? More like malfunction!')
  }

  const addedActivityToRoutine = await addActivityToRoutine(2, 1, 20, 200);
  if (addedActivityToRoutine && addActivityToRoutine.duration === 200) {
    console.log('addedActivityToRoutine: ', addedActivityToRoutine);
    console.log('addActivityToRoutine function is functional');
  }

  const updatedRoutineActivity = await updateRoutineActivity(15, 33, 222);
  if (updatedRoutineActivity && updatedRoutineActivity.count === 33) {
    console.log('updateRoutineActivity function is functional');
  } else {
    console.error('updateRoutineActivity function? More like malfunction!')
  }

};

console.log('Seeding database');
console.log('Seeding users table')

rebuildDb().then(testDB);
