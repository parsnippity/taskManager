const express = require("express");
const router = express.Router();
const {readAllUsers, createUser, readOneUser, updateUser, deleteUser} = require("../controllers/user");

router.get("/", readAllUsers);
router.post("/", createUser);
router.get("/:id", readOneUser)
router.put("/:oldId", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;