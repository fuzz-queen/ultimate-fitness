import {render} from "react-dom";
import { API_URL } from "./index";
import { useState, useEffect } from "react";

const Routines = ({user}) => {
    if (user) {
        return (
            <div>
                <RoutinesForm user={user} />
                <RoutinesForm user={user} />
            </div>
        )
    } else {
        return (
            <div>
                <RoutinesForm user={user} />
            </div>
        )
    }
}

const MyRoutines = ({user}) => {
    if (user) {
        return (
            <div>
                <RoutinesForm user={user} />
                <MyRoutinesList user={user} />
            </div>
        )
    } else {
        return (
            <div>
                <h4>You have to register before managing your own routines!</h4>
            </div>
        )
    }
}

const RoutineActivities = ({activities, user}) => {
    const [activitiesState, setActivitiesState] = useState(activities);
    const [updatedValues, setUpdatedValues] = useState(
        activities.reduce((acc, activity) => {
            acc[activity.id] = {duration: activity.duration, count: activity.count};
            return acc;
        }, {})
    );

    const handleUpdateActivity = async (id, routineActivityId) => {
        const {duration, count} = updatedValues[id];
        try {
            const resp = await fetch(`${API_URL}/routine_activities/${routineActivityId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${user.token}`
                },
                body: JSON.stringify({duration, count})
            });
        } catch (error) {
            
        }
        setActivitiesState((prevActivities) =>
        prevActivities.map((activity) =>
          activity.id === id ? { ...activity, duration, count } : activity
        )
      );
    }
    const handleRemoveActivity = async (id, routineActivityId) => {
        try {
            const resp = await fetch(`${API_URL}/routine_activities/${routineActivityId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${user.token}`
                }
            });
            const result = await resp.json();
            console.log("result from deleting activity: ", result);
        } catch (error) {}
        setActivitiesState((prevActivities) =>
            prevActivities.filter((activity) => activity.id !== id)
          );
    }
    const handleInputChange = (id, name, value) => {
        setUpdatedValues((prevValues) => ({
          ...prevValues,
          [id]: { ...prevValues[id], [name]: value }
        }));
      };
      const activitiesList = activitiesState.map((activity) => {
        return (
          <div key={activity.id}>
            <form>
              <label htmlFor="name">Name: </label>
              <span>{activity.name} </span>
              <label htmlFor="duration">Duration: </label>
              <input
                type="number"
                name="duration"
                defaultValue={activity.duration}
                onChange={(e) =>
                  handleInputChange(activity.id, e.target.name, e.target.value)
                }
              />
              <label htmlFor="count"> Count: </label>
              <input
                type="number"
                name="count"
                defaultValue={activity.count}
                onChange={(e) =>
                  handleInputChange(activity.id, e.target.name, e.target.value)
                }
              />
              <button type="button" onClick={() => handleUpdateActivity(activity.id, activity.routineActivityId)}>
                Update Activity
              </button>
              <button type="button" onClick={() => handleRemoveActivity(activity.id, activity.routineActivityId)}>
                Remove Activity
              </button>
            </form>
          </div>
        );
      });
    
      return <div className="activitieslist">{activitiesList}</div>;   
}
const MyRoutinesList = ({user}) => {
    const [routines, setRoutines] = useState([]);
    let routinesList = "";
    const fetchRoutines = async () => {
        try {
            const resp = await fetch(`${API_URL}/users/${user.username}/routines`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${user.token}`,
                },
            });
            const result = await resp.json();
            console.log("result from fetching routines: ", result);
            setRoutines(result);
        } catch (error) {
            
        }
    }
    useEffect(() => {
        fetchRoutines();
    }, [user]);
    routinesList = routines.map((routine) => {
        return (
            <div key={routine.id}>
            <RoutineUpdateForm routine={routine} user={user} />
                <RoutineActivities activities={routine.activity} user={user} />
                <AddActivityForm user={user} routineId={routine.id} />
            </div>
        )
    });

    return (
        <div>
            <h2>My Routines</h2>
            {routinesList}
        </div>
    )
}
const RoutineUpdateForm = ({routine, user}) => {
    const [routineName, setRoutineName] = useState(routine.name);
    const [routineGoal, setRoutineGoal] = useState(routine.goal);
    const [routinePublic, setRoutinePublic] = useState(routine.isPublic);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "name") {
            setRoutineName(value);
        } else if (name === "goal") {
            setRoutineGoal(value);
        } else if (name === "isPublic") {
            setRoutinePublic(value);
        }
    }
    const handleUpdateRoutine = async (event, id) => {
        event.preventDefault();
        const name = event.target.routineName.value;
        const goal = event.target.routineGoal.value;
        const isPublic = event.target.routinePublic.checked;
        try {
            const resp = await fetch(`${API_URL}/routines/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${user.token}`
                },
                body: JSON.stringify({
                    name,
                    goal,
                    isPublic
                })
            });
            const result = await resp.json();
            console.log("result from updating routine: ", result);
        } catch (error) {}
    }
    const handleDeleteRoutine = async (event, id) => {
        event.preventDefault();
        try {
            const resp = await fetch(`${API_URL}/routines/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${user.token}`
                }
            });
            const result = await resp.json();
            console.log("result from deleting routine: ", result);
        } catch (error) {}
    }

    return (
        <div className="routineform">
            <form onSubmit={(event) => handleUpdateRoutine(event, routine.id)}>
                <label htmlFor="routineName">Routine name:</label>
                <input type="text" name="name" onChange={handleInputChange} id="routineName" value={routineName} />
                <label htmlFor="routineGoal">Routine goal:</label>
                <input type="text" name="goal" onChange={handleInputChange} id="routineGoal" value={routineGoal} />
                <label htmlFor="routinePublic">Public?</label>
                <input type="checkbox" name="isPublic" onChange={handleInputChange} id="routinePublic" value={routinePublic} />
                <button>Update Routine</button>
                <button onClick={(event)=>{handleDeleteRoutine(event, routine.id)}}>Delete Routine</button>
            </form>
        </div>
    )
} 

const AddActivityForm = ({user, routineId}) => {
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState("");
    const [duration, setDuration] = useState(0);
    const [count, setCount] = useState(0);
    const handleDurationChange = (event) => {
        setDuration(event.target.value);
    }
    const handleCountChange = (event) => {
        setCount(event.target.value);
    }
    const fetchActivities = async () => {
        try {
            const resp = await fetch(`${API_URL}/activities`);
            const result = await resp.json();
            console.log("result from fetching activities: ", result);
            setActivities(result);
        } catch (error) {
            
        }
    }
    useEffect(() => {
        fetchActivities();
    }, [user]);
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const resp = await fetch(`${API_URL}/routines/${routineId}/activities`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    activityId: selectedActivity,
                    count: count,
                    duration: duration,
                }),
            });
            const result = await resp.json();
            console.log("result from adding activity: ", result);
        } catch (error) {
            console.log("error adding activity: ", error);
        }
    };
    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <label htmlFor="activities">Select an activity:</label>
                <select name="activities" id="activities" onChange={(event) => setSelectedActivity(event.target.value)}>
                    <option value="">Select an activity</option>
                    {activities.map((activity) => {
                        return (
                            <option key={activity.id} value={activity.id}>{activity.name}</option>
                        )
                    })}
                </select>
                <label htmlFor="duration">Duration:</label>
                <input type="number" name="duration" id="duration" value={duration} onChange={handleDurationChange} />
                <label htmlFor="count">Count:</label>
                <input type="number" name="count" id="count" value={count} onChange={handleCountChange} />
                <input type="submit" value="Add Activity" />
            </form>
        </div>
    )
}

const RoutinesForm = ({user}) => {
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const goal = document.getElementById("goal").value;
        const isPublic = document.getElementById("isPublic").checked;
        try {
            const resp = await fetch(`${API_URL}/routines`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${user.token}`,
                },
                body: JSON.stringify({
                    name: name,
                    goal: goal,
                    isPublic: isPublic,
                }),
            });
            const result = await resp.json();
            console.log("result from creating a new routine: ", result);
        } catch (error) {
            console.log("error creating a new routine: ", error);
        }
        //clear the form
        document.getElementById("name").value = "";
        document.getElementById("goal").value = "";
        document.getElementById("isPublic").checked = false;
    };

    if (user && user.id) {
        return (
            <div>
                <h2>Create a new routine ({user.username})</h2>
                <form>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" id="name" />
                    <label htmlFor="goal">Goal:</label>
                    <input type="text" name="goal" id="goal" />
                    <label htmlFor="isPublic">Public</label>
                    <input type="checkbox" name="isPublic" id="isPublic" />
                    <input type="submit" value="Create Routine" />
                </form>
            </div>
        )
    } else {
        return (<div></div>)
    }
}

const RoutinesList = ({user}) => {
    const [routines, setRoutines] = useState([]);
    let routinesTable = "";
    useEffect(() => {
        let newRoutines = [];
        const fetchRoutines = async () => {
            try {
                const resp = await fetch(`${API_URL}/routines`);
                const result = await resp.json();
                newRoutines = newRoutines.concat(result);
                if (user && user.id) {
                    const resp = await fetch(`${API_URL}/users/${user.username}/routines`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "authorization": `${user.token}`
                        }
                    });
                    const result = await resp.json();
                    const privateRoutines = result.filter((routine) => {
                        return routine.isPublic === false;
                    });
                    if (privateRoutines.length > 0) {
                        newRoutines = newRoutines.concat(privateRoutines);
                    }
                    setRoutines(newRoutines)
                }
            } catch (error) {
                
            }
        };
        fetchRoutines();
    }, [user]);
    
    if (!user || !user.id) {

    }

    routinesTable = renderRoutines(routines);
    return (routinesTable);
}

const renderActivities = (activities) => {
    const tableRows = activities.map((activity) => {
        return (
            <tr key={activity.id}>
                <td></td>
                <td>{activity.name}</td>
                <td>{activity.description}</td>
                <td>{activity.duration}</td>
                <td>{activity.count}</td>
            </tr>
        );
    });
    return (
        <>
        <tr>
            <td>Name</td>
            <td>Description</td>
            <td>Duration</td>
            <td>Count</td>
        </tr>
        {tableRows}
        </>
    )
}

const renderRoutines = (routines) => {
    const tableRows = routines.map((routine) => {
        return (
            <>
            <tr key={routine.id} className="routine">
                <td>Creator: {routine.creatorName}</td>
                <td>Routine: {routine.name}</td>
                <td>Goal: {routine.goal}</td>
                <td></td>
                <td></td>
            </tr>
            {renderActivities(routine.activity)}
            </>
        );
    });
    return (
        <table>
            <tbody>
                {tableRows}
            </tbody>
        </table>
    )
}

export default {Routines, MyRoutines};