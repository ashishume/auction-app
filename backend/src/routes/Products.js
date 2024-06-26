const express = require("express");
const router = express.Router();
const authenticateToken = require("../controllers/authMiddleware");
const pool = require("../controllers/db-connect");

// Create and save a new product
router.post("/product", authenticateToken, async (req, res) => {
  const {
    name,
    description,
    minBidPrice,
    productImage,
    lastDateBid,
    isExclusive,
    createdAt,
  } = req.body;
  try {
    const results = await pool.query(
      `INSERT INTO products (
      name, 
      description, 
      min_bid_price, 
      product_image,
      last_date_bid, 
      is_exclusive, 
      created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        name,
        description,
        minBidPrice,
        productImage,
        lastDateBid,
        isExclusive,
        createdAt,
      ]
    );
    res
      .status(201)
      .json({ id: results.rows[0].id, message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/products", authenticateToken, async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    if (results.rowCount) {
      let newResults = [];
      results.rows.forEach((row) => {
        newResults.push({
          ...row,
          is_bidding_date_expired: row.last_date_bid < row.created_at, // is bidding date already gone
        });
      });

      return res.status(200).json({ data: newResults });
    } else {
      res.status(200).json({ data: [], message: "No products found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/product/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const results = await pool.query("SELECT * FROM products WHERE id=$1", [
      id,
    ]);
    if (results.rowCount) {
      const row = results.rows[0];
      const newResult = {
        ...row,
        is_bidding_date_expired: row.last_date_bid < row.created_at,
      };
      return res.status(200).json({ data: newResult });
    } else {
      res.status(200).json({ data: [], message: "No products found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
