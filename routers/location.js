const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyn.js");

const ListingController = require("../controllers/listings.js");

// Search by location Route
router.get('/:location', wrapAsync(ListingController.locationSearch));

module.exports = router;