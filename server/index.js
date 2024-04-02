const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const UserModel = require('./User'); // Assurez-vous que votre modèle utilisateur est défini pour gérer `name`, `email`, et `password`
const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", // Supprimez le slash final
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser());

const DB_URL = process.env.ON === 'false' ? process.env.DB_URL : process.env.DB_URI;
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log("Failed to connect to DB", err));

app.post('/LoginSignup', (req, res) => { // Changé à '/' pour correspondre à votre frontend, ou ajustez votre frontend pour utiliser '/LoginSignup'
    const { name, email, password } = req.body; // Utilisation des champs corrects
    // Vérifier si l'email de l'utilisateur existe déjà dans la base de données
    UserModel.findOne({ email: email })
        .then(existingUser => {
            if (existingUser) {
                // L'email existe déjà, renvoyer un message d'erreur
                res.status(400).json({ message: "User already exists" });
            } else {
                // L'email n'existe pas, créer une nouvelle entrée dans la base de données avec name, email, et password
                UserModel.create({ name, email, password })
                    .then(newUser => res.json({ message: "User created successfully" }))
                    .catch(err => res.status(500).json({ error: err.message }));
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/register', (req, res) => {
    const { user,username } = req.body;
    UserModel.findOne({ user: user })
    .then(existingUser => {
        if (existingUser) {
            // L'utilisateur existe déjà, renvoyer un message d'erreur
            res.status(400).json({ message: "User already exists" });
        } else {
            // L'utilisateur n'existe pas, créer une nouvelle entrée dans la base de données
            UserModel.create({ user: user , userName : username })
                .then(user => res.json("Success"))
                .catch(err => res.status(500).json(err));
        }
    })
    .catch(err => res.status(500).json(err));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

