import React, { useEffect, useState } from "react";
import { auth, db } from "../services/firebaseConfig";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    type User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

const LoginFirebase: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mode, setMode] = useState<"login" | "register">("login");

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (mode === "login") {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                // 🔹 Rejestracja w Firebase Auth
                const cred = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                // 🔹 Zapis do Firestore zgodnie z typem UserType
                await setDoc(doc(db, "users", cred.user.uid), {
                    uid: cred.user.uid,
                    email: cred.user.email || "",
                    displayName: firstName + " " + lastName || "",
                    firstName,
                    lastName,
                });
            }
        } catch (err: any) {
            alert(err.message || String(err));
        }
    };

    const handleGoogle = async () => {
        try {
            const cred = await signInWithPopup(auth, provider);
            const userRef = doc(db, "users", cred.user.uid);

            // 🔹 Jeśli użytkownik nie istnieje w Firestore, utwórz go
            await setDoc(
                userRef,
                {
                    uid: cred.user.uid,
                    email: cred.user.email || "",
                    displayName: cred.user.displayName || "",
                    firstName: cred.user.displayName?.split(" ")[0] || "",
                    lastName: cred.user.displayName?.split(" ")[1] || "",
                },
                { merge: true } // nie nadpisuj istniejącego
            );
        } catch (err: any) {
            alert(err.message || String(err));
        }
    };

    return (
        <div className="p-2">
            {!user && (
                <div
                    className="card p-4"
                    style={{ width: "100%", maxWidth: "500px" }}
                >
                    <form onSubmit={handleEmailAuth} className="mb-3">
                        {mode === "register" && (
                            <>
                                <div className="mb-3">
                                    <input
                                        className="form-control form-control-lg"
                                        placeholder="First name"
                                        value={firstName}
                                        onChange={(e) =>
                                            setFirstName(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        className="form-control form-control-lg"
                                        placeholder="Last name"
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div className="mb-3">
                            <input
                                className="form-control form-control-lg"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                type="email"
                            />
                        </div>

                        <div className="mb-4">
                            <input
                                className="form-control form-control-lg"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                type="password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 mb-3"
                        >
                            {mode === "login" ? "Sign In" : "Create Account"}
                        </button>

                        <div className="text-center">
                            {mode === "login" ? (
                                <p className="text-muted mb-0">
                                    Don't have an account?{" "}
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setMode("register");
                                        }}
                                        className="text-primary text-decoration-none"
                                    >
                                        Sign up
                                    </a>
                                </p>
                            ) : (
                                <p className="text-muted mb-0">
                                    Already have an account?{" "}
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setMode("login");
                                        }}
                                        className="text-primary text-decoration-none"
                                    >
                                        Sign in
                                    </a>
                                </p>
                            )}
                        </div>
                    </form>

                    <div className="d-flex align-items-center mb-3">
                        <hr className="flex-grow-1" />
                        <span className="mx-3 text-muted">or</span>
                        <hr className="flex-grow-1" />
                    </div>

                    <button
                        className="btn btn-outline-dark btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleGoogle}
                    >
                        <svg
                            width="18"
                            height="18"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 488 512"
                        >
                            <path
                                fill="currentColor"
                                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                            />
                        </svg>
                        Continue with Google
                    </button>
                </div>
            )}
        </div>
    );
};

export default LoginFirebase;
