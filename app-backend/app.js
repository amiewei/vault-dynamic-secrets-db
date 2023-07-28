// require("dotenv").config();
const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;
const cors = require("cors");
app.use(cors());

// app.use(express.static("public")); // if there is frontend
const indexRouter = require("./routes/index");
const dbRouter = require("./routes/db");
const connectionPool = require("./middleware/dbConnect");

// Start the server
(async function startServer() {
    const pool = await connectionPool();
    app.use("/", indexRouter);
    app.use("/api", dbRouter(pool));

    app.use(function (err, req, res, next) {
        res.status(err.status || 500).json({ error: err.message });
    });
})();

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
