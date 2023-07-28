const express = require("express");
const router = express.Router();

module.exports = (pool) => {
    // get all DB users
    router.get("/users", async (req, res, next) => {
        try {
            const results = await pool.query(
                "SELECT usename, valuntil FROM pg_user;"
            );
            res.json(results.rows);
        } catch (error) {
            const err = new Error("Error listing users");
            err.detail = error;
            next(err);
        }
    });
    // get all DB tables
    router.get("/tables", async (req, res, next) => {
        try {
            const results = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
            res.json(results.rows);
        } catch (error) {
            const err = new Error("Error listing tables");
            err.detail = error;
            next(err);
        }
    });

    // get acme_product table
    router.get("/acmeproducts", async (req, res, next) => {
        try {
            const results = await pool.query("SELECT * FROM acme_products;");
            res.json(results.rows);
        } catch (error) {
            const err = new Error("Error fetching products");
            err.detail = error;
            next(err);
        }
    });

    // delete a row from the product table based on product id
    router.get("/acmeproducts/delete/:productId", async (req, res, next) => {
        try {
            console.log("delete path");
            const productId = parseInt(req.params.productId);

            if (isNaN(productId)) {
                return next(new Error("Product id is invalid")); //create new error and pass to middleware
            }

            const queryText = "DELETE FROM acme_products WHERE id = $1;";
            const queryValues = [productId];

            const results = await pool.query(queryText, queryValues);

            if (results.rowCount === 0) {
                return next(new Error("Product not found"));
            }

            res.json({ message: "Row deleted successfully" });
        } catch (error) {
            const err = new Error("Error deleting product");
            err.detail = error;
            next(err);
        }
    });

    return router;
};
