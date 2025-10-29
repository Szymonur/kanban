import React, { useEffect, useState } from "react";
import { auth } from "../services/firebaseConfig";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";

const UserMenu: React.FC = () => {
    const [user, setUser] = useState<User | null>(auth.currentUser);
	
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    if (!user) return <div style={{ width: "48px" }} />;

    return (
        <div className="d-flex align-items-center gap-2">
            <div className="text-muted small">Welcome, {user.email}</div>
            <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => signOut(auth)}
            >
                Sign Out
            </button>
        </div>
    );
};

export default UserMenu;
