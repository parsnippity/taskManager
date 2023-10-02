const express = require("express");
const router = express.Router();
const {readAllTasks, createTask, readOneTask, updateTask, deleteTask} = require("../controllers/task");

router.get("/", readAllTasks);
router.post("/", createTask);
router.get("/:id", readOneTask)
router.put("/:oldId", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;