const express = require("express");
const router = express.Router();
const authenticateToken = require("../controllers/authMiddleware");
const pool = require("../controllers/db-connect");

// Create and save a new product
router.post("/product", async (req, res) => {
  //TODO: create a common method to make these generic
  const { name, description, minBidPrice, lastDateBid, createdAt } = req.body;
  try {
    const results = await pool.query(
      `INSERT INTO products (name, description, min_bid_price, last_date_bid, created_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [name, description, minBidPrice, lastDateBid, createdAt]
    );
    res
      .status(201)
      .json({ id: results.rows[0].id, message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM products");
    if (results.rowCount) {
      let newResults = [];
      results.rows.forEach((row) => {
        newResults.push({
          ...row,
          isBiddingDateExpired: row.last_date_bid < row.created_at,  // is bidding date already gone
        });
      });

      return res.status(200).json(newResults);
    } else {
      res.status(404).json({ message: "No products found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
