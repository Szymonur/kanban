import KanbanBoard from "./components/KanbanBoard";
import LoginFirebase from "./components/LoginFirebase";
import TypewriterText from "./components/TypewriterText";
import { auth } from "./services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="container-fluid vh-100 vw-100 d-flex ">
            {!user && (
                <div className="login-container">
                    <div className="welcome-text mb-4">
                        <div>
                            <h1>Let's get started!</h1> <br />
                            <TypewriterText
                                text="Log in to organize your work with Kanban."
                                className="h2 typing-cursor"
                                delay={50}
                            />
                        </div>
                    </div>

                    <div className="login-box">
                        <LoginFirebase />
                    </div>
                </div>
            )}
            {user && <KanbanBoard />}
        </div>
    );
}

export default App;
