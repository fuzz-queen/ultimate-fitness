// Create dummy data to seed into your DB
const users = [
    {"id": 1, "username": "relativity.guy@physics.org", "password": "e=mc^2"},
    {"id": 2, "username": "the.hulk@green.com", "password": "password2"},
    {"id": 3, "username": "spiderman@marvel.com", "password": "password3"},
    {"id": 4, "username": "tony.stark@starkindustries.com", "password": "password4"},
    {"id": 5, "username": "sherlock.holmes@bakerstreet.com", "password": "password5"},
    {"id": 6, "username": "harry.potter@hogwarts.edu", "password": "password6"},
    {"id": 7, "username": "frodo.baggins@shire.net", "password": "password7"},
    {"id": 8, "username": "luke.skywalker@jedi.net", "password": "password8"},
    {"id": 9, "username": "wonder.woman@dc.com", "password": "password9"},
    {"id": 10, "username": "batman@gotham.net", "password": "password10"},
    {"id": 11, "username": "james.bond@mi6.gov.uk", "password": "password11"},
    {"id": 12, "username": "indiana.jones@archaeology.edu", "password": "password12"},
    {"id": 13, "username": "captain.kirk@starfleet.net", "password": "password13"},
    {"id": 14, "username": "marty.mcfly@backtothefuture.com", "password": "password14"},
    {"id": 15, "username": "darth.vader@sith.net", "password": "password15"},
    {"id": 16, "username": "yoda@jedi.net", "password": "password16"},
    {"id": 17, "username": "gandalf@middleearth.net", "password": "password17"},
    {"id": 18, "username": "bilbo.baggins@shire.net", "password": "password18"},
    {"id": 19, "username": "aragorn@gondor.net", "password": "password19"},
    {"id": 20, "username": "legolas@mirkwood.net", "password": "password20"}
];

const activities = [
    {"id": 1, "name": "Bench Press", "description": "A weight training exercise that targets the chest muscles, as well as the triceps and shoulders."},
    {"id": 2, "name": "Treadmill", "description": "A cardiovascular exercise machine that simulates walking or running."},
    {"id": 3, "name": "Rowing Machine", "description": "A cardiovascular exercise machine that simulates the motion of rowing a boat."},
    {"id": 4, "name": "Squats", "description": "A strength training exercise that targets the lower body, including the quadriceps, hamstrings, and glutes."},
    {"id": 5, "name": "Pull-ups", "description": "A strength training exercise that targets the upper body, including the back, shoulders, and biceps."},
    {"id": 6, "name": "Deadlift", "description": "A weight training exercise that targets multiple muscle groups, including the legs, back, and core."},
    {"id": 7, "name": "Elliptical", "description": "A cardiovascular exercise machine that simulates a low-impact running motion."},
    {"id": 8, "name": "Push-ups", "description": "A bodyweight exercise that targets the chest, triceps, and shoulders."}
];

const routines = [
    {"name": "strength training", "goal": "Develop strength and endurance", "creator_id": 1, "is_public": "TRUE"},
    {"name": "cardio", "goal": "Develop cardiovascular endurance", "creator_id": 2, "is_public": "TRUE"},
    {"name": "iron person", "goal": "Become an iron person, kick @$$", "creator_id": 3, "is_public": ""},
    {"name": "marathon", "goal": "Run forever", "creator_id": 4, "is_public": "FALSE"}
];

const routine_activities = [
    //routine: strength training, activity: bench press
    {"routine_id": 1, "activity_id": 1, "count": 3, "duration": 10},
    //routine: strength training, activity: squats
    {"routine_id": 1, "activity_id": 4, "count": 3, "duration": 10},
    //routine: strength training, activity: pull-ups
    {"routine_id": 1, "activity_id": 5, "count": 3, "duration": 10},
    //routine: cardio, activity: treadmill
    {"routine_id": 2, "activity_id": 2, "count": 1, "duration": 30},
    //routine: cardio, activity: rowing machine
    {"routine_id": 2, "activity_id": 3, "count": 1, "duration": 30},
    //routine: cardio, activity: elliptical
    {"routine_id": 2, "activity_id": 7, "count": 1, "duration": 30},
    //routine: iron person, activity: treadmill
    {"routine_id": 3, "activity_id": 2, "count": 1, "duration": 60},
    //routine: iron person, activity: rowing machine
    {"routine_id": 3, "activity_id": 3, "count": 1, "duration": 60},
    //routine: iron person, activity: elliptical
    {"routine_id": 3, "activity_id": 7, "count": 1, "duration": 60},
    //routine: iron person, activity: push-ups
    {"routine_id": 3, "activity_id": 8, "count": 1, "duration": 20},
    //routine: iron person, activity: pull-ups
    {"routine_id": 3, "activity_id": 5, "count": 1, "duration": 20},
    //routine: marathon, activity: treadmill
    {"routine_id": 4, "activity_id": 2, "count": 1, "duration": 120},
    //routine: marathon, activity: rowing machine
    {"routine_id": 4, "activity_id": 3, "count": 1, "duration": 120},
    //routine: marathon, activity: elliptical
    {"routine_id": 4, "activity_id": 7, "count": 1, "duration": 180}
];

function getSeedUsers() {
    return users;
}

function getSeedActivities() {
    return activities;
}

function getSeedRoutines() {
    return routines;
}

function getSeedRoutineActivities() {
    return routine_activities;
}

module.exports = { getSeedUsers, getSeedActivities, getSeedRoutines, getSeedRoutineActivities };
