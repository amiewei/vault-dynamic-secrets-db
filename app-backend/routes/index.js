const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    console.log(" base route");
    res.status(200).send("up and running");
});

module.exports = router;
