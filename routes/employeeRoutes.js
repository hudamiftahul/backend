const express = require("express");
const router = express.Router();

const  {
    getEmployees,
    addEmployees,
    deleteEmployees,
    updateEmployees,
} = require("../controllers/employeControllers");

router.get("/", getEmployees);
router.post("/", addEmployees);
router.delete("/:id", deleteEmployees);
router.put("/:id", updateEmployees);

module.exports = router;