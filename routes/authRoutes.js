const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const Firestore = require("@google-cloud/firestore");
const isAuthenticated = require("../middlewares/authMiddleware");
const bcrypt = require("bcrypt");
const authRouter = express.Router();

// Creates a client using Application Default Credentials
const db = new Firestore({
    projectId: 'famous-rhythm-362419',
    keyFilename: path.join(__dirname, '../creds.json')
});
const secret = "my-secret-key";

authRouter.get("/myUsers", isAuthenticated, async (req, res) => {
    // If the user is not authenticated, return an error
    if (!req.user) {
        return res.status(401).send('Unauthorized123');
    }
    // The user is authenticated, so return the user data
    const user = await db.collection("users").doc(req.user.username).get();
    if (!user.data()) {
        res.status(401).json({ status: "User doesnot exists" });
    } else {
        res.status(200).json(user.data());
    }
});

authRouter.post("/signUp", async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const user = await db.collection("users").doc(username).get();
    if (user.data()) {
        res.json({ status: "User already exists in the database" });
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        //Create new user in the database cloud firstore database
        await db.collection("users").doc(username).set({
            username,
            email,
            password: hashedPassword
        });
        const token = jwt.sign({ username }, secret, { expiresIn: 60 * 60 });
        res.json({ token });
    }
});

authRouter.post("/signIn", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await db.collection("users").doc(username).get();
    const userSigned = await bcrypt.compare(password, user.data().password);
    if (userSigned) {
        const token = jwt.sign({ username }, secret, { expiresIn: 60 * 60 });
        res.json({ token });
    } else {
        res.json({ status: "User doesnot exists or check your credentials" });
    }
});

module.exports = authRouter;