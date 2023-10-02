const User = require("../models/User");
//post put and get one all require success true/false

//Get function for all users
//get "/"
const readAllUsers = async (req, res) => {
    try {
        let item = await User.find({});
        res.json({success: true, data: item});
    } catch(err) {
        console.log(err)
    }
}

//post "/"
//see if this works without a name
//there isn't anything in my mongo
const createUser = async(req, res) => {
    try {
        const {name, age, id} = req.body;
        let item = await User.findOne({id: id});
        if(!name || !id || !age){
            console.log("not all fields are filled out");
            return res.json({data: [], success: false, msg: "Please fill out all fields"})
        } else if(item != null) {
            console.log("a user with that id already exists");
            return res.json({data: [], success: false, msg: "that id's already taken, try another"})
        } else {
            let itemTwo = await User.create(req.body);
            res.json({success: true, data: itemTwo});
        }
    } catch(err) {
        console.log(err);
    }
}

//get "/:id"
const readOneUser = async(req, res) => {
    try {
        const {id} = req.params;
        let item = await User.findOne({id: id});
        if(!item) {
            return res.json({success: false, data: []})
        }
        res.json({success: true, data: item});
    } catch(err) {
        console.log(err);
    }
}

//put "/:oldId"
const updateUser = async(req, res) => {
    try {
        const {oldId} = req.params;
        let item = await User.findOneAndUpdate({id: oldId}, req.body);
        if(!item) {
            return res.json({success: false, data: []});
        }
        res.json({data: item, success: true})
    } catch(err) {
        console.log(err);
    }
}

//delete "/:id"
const deleteUser = async(req, res) => {
    //reassign the assigned ones
    try {
        const {id} = req.params;
        console.log(id);
        let item = await User.findOneAndDelete({id: id});
        if(item == null) {
            console.log("no user exists with that id");
            res.json({success: false, msg: "no user exists with that id"})
        } else {
            //this returns what was replaced
            console.log(item);
            res.json({data: item, success: true});
        }
    } catch(err) {
        console.log(err);
    }
}

module.exports = {readAllUsers, createUser, readOneUser, updateUser, deleteUser};