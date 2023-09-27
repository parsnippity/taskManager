const express = require("express");
const app = express();
let { tasks } = require("./data");
const path = require("path");

//Static assets
app.use(express.static("./public"));
//Parse Form and JSON Data
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})

//Get function for all tasks
app.get("/tasks", (req, res) => {
    res.json({success: true, data: tasks});
})

//post function for creating tasks
app.post("/tasks", (req, res) => {
    const {name,id,desc} = req.body;
    if(!name || !id || !desc) {
        return res.json({data: [], success: false, msg: "Please fill out all fields"})
    }
    let task = {id: id, name:name, description:desc, done: false}
    tasks.push(task);
    res.status(201).json({success: true, data: [tasks]})
})

app.get("/tasks/:id", (req, res) => {
    const {id} = req.params;
    const task = tasks.find((task) => {
        console.log(task);
        return task.id === Number(id);
    })
    if(!task) {
        return res.json({success: false, data: []});
    }
    res.json({success: true, data: task});
})

app.get("/edit", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/edit.html"))
})

//put function for updating tasks
app.put("/tasks/:oldId", (req, res) => {
    const {oldId} = req.params;
    const {name, desc, id, done} = req.body;
    const task = tasks.find((task) => {
        return task.id === Number(oldId);
    })
    if(!task) {
        return res.json({success: false, data: []});
    }
    const newTasks = tasks.map((task) => {
        if(task.id === Number(oldId)) {
            task.name = name;
            task.desc = desc;
            task.id = id;
            task.done = done;
        }
        return task;
    })
    res.status(202).json({data: newTasks, success: true});
})

//delete function for deleting tasks
app.delete("/tasks/:id", (req, res) => {
    const {id} = req.params;
    const task = tasks.find((task) => {
        return task.id === Number(id);
    })
    if(!task){
        res.status(404).json({success: false, msg: "No matching id found"})
    }
    tasks = tasks.filter((task) => {
        return task.id != Number(id);
    })
    res.status(202).json({data: tasks, success: true});
})

const initServer = async() => {
    try {
        app.listen(5000, () => {
            console.log("Listening on port 5000");
        })
    } catch(err) {
        console.log(err);
    }
}
initServer();