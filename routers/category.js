const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyn.js");

const ListingController = require("../controllers/listings.js");

// Category Route
router.get('/:category', wrapAsync(ListingController.categorySearch));

module.exports = router;



