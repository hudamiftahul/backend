const express = require("express");
const router = express.Router();

const  {
    getUsers,
    addUsers,
    deleteUsers,
    updateUsers,
} = require("../controllers/userControllers");

router.get("/", getUsers);
router.post("/", addUsers);
router.delete("/:id", deleteUsers);
router.put("/:id", updateUsers);

module.exports = router;