//Something isn't right!

const express = require("express");
const app = express();
const path = require("path");
const taskRoute = require("./routes/taskController")
const userRoute = require("./routes/userController");
require("dotenv").config();
const connectDB = require("./db/connect");

//Static assets
app.use(express.static("./public"));
//Parse Form and JSON Data
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})
app.get("/edit", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/edit.html"))
})
app.get("/editUser", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/editUser.html"))
})
app.use("/tasks", taskRoute);
app.use("/users", userRoute);

const initServer = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(5000, () => {
            console.log("Listening on port 5000");
        })
    } catch(err) {
        console.log(err);
    }
}
initServer();