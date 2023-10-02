const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
    name: {
        type:String,
        maxLength:[40, "The name cannot exceed 20 characters"]
    },
    description:{
        type:String
    },
    id:{
        type:Number
    },
    done:{
        type:Boolean,
        default: false
    },
    assignedTo:{
        type:String,
        default:"none"
    }
}, {collection: "tasks"})

module.exports = mongoose.model("Task", taskSchema);