const Task = require("./models/Task");
const User = require("./models/User");
const taskData = require("./taskData");
const taskArray = taskData.tasks;
const userData = require("./userData");
const userArray = userData.users;
require("dotenv").config();
const connectDB = require("./db/connect");

const uploadTasks = async() => {
    try {
        await Task.create(taskArray);
    } catch(err) {
        console.log(err);
    }
}
const uploadUsers = async() => {
    try {
        await User.create(userArray);
    } catch(err) {
        console.log(err);
    }
}
const connect = async() => {
    await connectDB(process.env.MONGO_URI);
}
connect().then(uploadUsers()).then(uploadTasks());