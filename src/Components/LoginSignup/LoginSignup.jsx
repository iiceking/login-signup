import React, { useState } from 'react';
import './LoginSignup.css';
import { useNavigate } from 'react-router-dom';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const LoginSignup = () => {
    const navigate = useNavigate();
    const [action, setAction] = useState("Login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(""); // État pour stocker le message de retour

    const handleSubmit = async () => {
        const endpoint = action === "Login" ? "auth/login" : "auth/signup";
        const url = `http://localhost:5000/${endpoint}`;
        const data = action === "Login" ? { email, password } : { name, email, password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage('Success: ' + result.message); // Affiche le message de succès
                // Redirection ou autre logique post-connexion
                navigate('/Calendrier')
            } else {
                setMessage('Error: ' + result.message); // Affiche le message d'erreur
            }
        } catch (error) {
            setMessage('Error: ' + error.toString()); // Gestion des erreurs de requête ou réseau
        }
    };

    return (
        <div className='container'>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action === "Sign Up" && <div className="input">
                    <img src={user_icon} alt="User Icon" />
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>}
                <div className="input">
                    <img src={email_icon} alt="Email Icon" />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input">
                    <img src={password_icon} alt="Password Icon" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
            {action === "Login" && <div className="forgot-password">Lost password? <span>Click Here!</span></div>}
            <div className="submit-container">
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Sign Up")}>Sign Up</div>
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>Login</div>
                <div className="submit" onClick={handleSubmit}>Submit</div>
            </div>
            {message && <div className="message-container">{message}</div>} {/* Affichage du message */}
        </div>
    );
};

export default LoginSignup;
