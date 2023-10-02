const Task = require("../models/Task");
//post put and get one all require success true/false

//Get function for all tasks
//get "/"
const readAllTasks = async (req, res) => {
    try {
        let item = await Task.find({});
        res.json({success: true, data: item});
    } catch(err) {
        console.log(err)
    }
}

//post "/"
//see if this works without a name
const createTask = async(req, res) => {
    try {
        const {name, desc, id} = req.body;
        let item = await Task.findOne({id: id});
        if(!name || !id || !desc){
            console.log("not all fields are filled out");
            return res.json({data: [], success: false, msg: "Please fill out all fields"})
        } else if(item != null) {
            console.log("a task with that id already exists");
            return res.json({data: [], success: false, msg: "that id's already taken, try another"})
        } else {
            let itemTwo = await Task.create(req.body);
            res.json({success: true, data: itemTwo});
        }
    } catch(err) {
        console.log(err);
    }
}

//get "/:id"
const readOneTask = async(req, res) => {
    try {
        const {id} = req.params;
        //it errors even the first time, after this console.log
        //I think the error's with the res.json
        //no, it fails anyway
        let item = await Task.findOne({id: id});
        if(!item) {
            return res.send({success: false, data: []})
        }
        res.send({success: true, data: item});
    } catch(err) {
        console.log(err);
    }
}

//put "/:oldId"
const updateTask = async(req, res) => {
    try {
        const {oldId} = req.params;
        console.log(`oldId exists: ${oldId}`);
        let item = await Task.findOneAndUpdate({id: oldId}, req.body);
        console.log(`We found it? we updated? let's see: ${item}`);
        if(!item) {
            return res.json({success: false, data: []});
        }
        res.json({data: item, success: true})
    } catch(err) {
        console.log(err);
    }
}

//delete "/:id"
const deleteTask = async(req, res) => {
    try {
        const {id} = req.params;
        let item = await Task.findOneAndDelete({id: id});
        if(item == null) {
            console.log("no task exists with that id");
            res.json({success: false, msg: "no task exists with that id"})
        } else {
            //this returns what was replaced
            console.log(item);
            res.json({data: item, success: true});
        }
    } catch(err) {
        console.log(err);
    }
}

module.exports = {readAllTasks, createTask, readOneTask, updateTask, deleteTask};

/*//Get function for all tasks
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
})*/