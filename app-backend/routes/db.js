const express = require("express");
const router = express.Router();

// router.use(dbConnect)
module.exports = (pool) => {
    // GET endpoint to fetch all DB users
    router.get("/users", async (req, res) => {
        console.log("user route");
        try {
            const results = await pool.query(
                "SELECT usename, valuntil FROM pg_user;"
            );
            console.log(results.rows);
            res.json(results.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.get("/tables", async (req, res) => {
        console.log("list all tables");
        try {
            const results = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
            console.log(results.rows);
            res.json(results.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    // GET endpoint to read the Disney table
    router.get("/disney", async (req, res) => {
        console.log("disney route");

        try {
            const results = await pool.query(
                "SELECT * FROM disney_characters;"
            );
            console.log(results.rows);
            res.json(results.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    // GET endpoint to read the Acme table
    router.get("/acmeproducts", async (req, res) => {
        console.log("acmeproducts route");

        try {
            const results = await pool.query("SELECT * FROM acme_products;");
            console.log(results.rows);
            res.json(results.rows);

            // if there is front end
            // console.log("results:");
            // console.log(results.rows);
            // res.setHeader("Content-Type", "application/json");
            // res.status(200);
            // res.send(JSON.stringify(results.rows));
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    // DELETE endpoint to delete a row from the Disney table
    router.get("/acmeproducts/delete/:productId", async (req, res) => {
        try {
            console.log("delete path");
            const productId = parseInt(req.params.productId);

            // Check if productId is a valid integer
            if (isNaN(productId)) {
                return res
                    .status(400)
                    .json({ error: "productId must be a valid integer" });
            }

            const queryText = "DELETE FROM acme_products WHERE id = $1;";
            const queryValues = [productId];

            console.log(queryText);

            const results = await pool.query(queryText, queryValues);

            if (results.rowCount === 0) {
                return res.status(404).json({ error: "Product not found" });
            }

            res.json({ message: "Row deleted successfully" });
        } catch (error) {
            console.error(error);
            console.log("caught error");
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};
