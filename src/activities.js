import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {API_URL} from "./index";

const ActivitiesList = () => {
    const [activities, setActivities] = useState([]);
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const resp = await fetch(`${API_URL}/activities`);
                const result = await resp.json();
                setActivities(result);

            } catch (error) {
                console.error("hit a problem fetching the list", error);
            }
        };
        fetchActivities();
    }, []);

    const activitiesTable = activities.map((activity) => {
        return(
            <tr key={activity.id}>
                <td>{activity.name}</td>
                <td>{activity.description}</td>
            </tr>
        )
    });

    return (
        <table>
            <thead>
                <th>Name</th>
                <th>Description</th>
            </thead>
            <tbody>
                {activitiesTable}
            </tbody>
        </table>
    )
}

const NewActivityForm = ({user}) => {
    const submitHandler = async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const name = formData.get("name");
        const description = formData.get("description");
        const newActivity = {
            name: name,
            description: description
        };
        try {
            const resp = await fetch (`${API_URL}/activities`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${user.token}`
                },
                body: JSON.stringify(newActivity)
            });
            const result = await resp.json;
        } catch (error) {
            console.error("ran into an issue: ", error)
        }
    }

    return (
        <form onSubmit={submitHandler}>
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" />
            <label htmlFor="description">Description</label>
            <input type="text" name="description" id="description" />
            <input type="submit" value="Create Activity" />
        </form>
    )
}

const Activities = ({user}) => {
    if (user && user.id) {
        return (
            <div>
                <h2>Create a new activity</h2>
                <NewActivityForm user={user}/>
                <h2>Activities</h2>
                <ActivitiesList />
            </div>
        )
    } else {
        return (
            <div>
                <h2>Activities</h2>
                <ActivitiesList />
            </div>
        )
    }
}

export default Activities;