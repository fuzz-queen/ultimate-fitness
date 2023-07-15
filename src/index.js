import React from "react";
import ReactDOM from "react-dom";
import { useState, useEffect, link } from "react";
import './index.css';

import {Routines, MyRoutines} from './routines'
import Activities from "./activities";

const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

const App = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentContent, setCurrentContent] = useState("/");
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('user', JSON.stringify(currentUser));
        }
    }, [currentUser]);

    const links = [
        {text: "Home", href: "/"},
        {text: "Routines", href: "/routines"},
        {text: "My Routines", href: "/myroutines"},
        {text: "Activities", href: "/activities"}
    ];

    const handleNavigatorClick = (event) => {
        event.preventDefault();
        if (event.target.href) {
            history.pushState(null, null, event.target.href);
            const content = event.target.href.replace(BASE_URL, "");
            setCurrentContent(content);
        } else {
            console.log("no href");
        }
    }

    return (
        <>
            <Header />
            <div className="container">
                <NavigatorSidebar currentUser={currentUser} setCurrentUser={setCurrentUser} links={links} navClickHandler={handleNavigatorClick} />
                <Main user={currentUser} content={currentContent}/>
            </div>
        </>
    )
}

const Header = () => {
    return (
        <header id="header">
            <h1>Fitness Trackr</h1>
        </header>
    );
}

const UserSidebar = () => {
    return (
        <nav id="user" class="right">
            <h2>User</h2>
        </nav>
    );
}

const NavigatorSidebar = ({currentUser, setCurrentUser, links, navClickHandler}) => {
    const linkList = links.map((link, index) => {
        return (
            <li key={index}>
                <a href={link.href} onClick={navClickHandler}>{link.text}</a>
            </li>
        );
    });

    const username = (currentUser && currentUser.username) ? currentUser.username: "No User";
    return (
        <nav id="navigator" className="left">
            <h2>Navigator</h2>
            <ul>
                {linkList}
            </ul>
            <User currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </nav>
    )
}

const handleRegister = (event, setCurrentUser) => {
    event.preventDefault();
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const user = {username, password};
    
    document.querySelector("#username").value = "";
    document.querySelector("#password").value = "";

    try {
        fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        }).then((response) => response.json())
        .then((result) => {
            console.log("result: ", result);
            if (result.error) {
                throw(result.error);
            }
        })
        .catch((error) => {
            console.error("Had a problem registering: ", error);
            alert("We ran into an error: ", error);
        })
    } catch (error) {
        console.error("Had a problem registering: ", error);
    }
}

const User = ({currentUser, setCurrentUser}) => {
    const handleLogout = (event) => {
        event.preventDefault();
        setCurrentUser(null);
    }
    if (currentUser) {
        return (
            <div id="user">
                <h4>Current User: {currentUser.username}</h4>
                <button onClick={handleLogout}>Logout</button>
            </div>
        );
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={(event) => handleLogin(event, setCurrentUser)}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" />
                <input type="submit" value="Login" />
                <a href="/register" onClick={(event) => handleRegister(event, setCurrentUser)}>Register</a>
            </form>
        </div>
    )
}

const handleLogin = (event, setCurrentUser) => {
    event.preventDefault();
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const user = {username, password};
    document.querySelector("#username").value = "";
    document.querySelector("#password").value = "";

    try {
        fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user)
        })
        .then((response) => response.json())
        .then((result) => {
            if (result.token) {
                result.user.token = "Bearer " + result.token;
                setCurrentUser(result.user)
            } else {
                if (result.error) {
                    if (result.error === "User does not exist") {
                        alert("We couldn't find a user by that name")
                    } else {
                        alert("Uh-oh! ", result.error)
                    }
                }
            }
        })
    } catch (error) {
        throw error
    }
}

const Main = ({user, content}) => {
    let mainContent = "";
    if (content === "/routines") {
        mainContent = <Routines user={user} />
    }
    if (content === "/activities") {
        mainContent = <Activities user={user} />
    }
    if (content === null || content === "/" || content === "") {
        mainContent = <DefaultMainContent />
    }
    return (
        <main id="main">
            <div>{mainContent}</div>
        </main>
    )
}

const DefaultMainContent = () => {
    return (
        <div>
            <h2>Welcome to FitnessTrackr!</h2>
            <div>uwu</div>
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
)

export {API_URL}