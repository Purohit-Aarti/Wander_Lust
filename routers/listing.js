const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyn.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");

const ListingController = require("../controllers/listings.js");

// Index Route
router.get("/", wrapAsync(ListingController.index));

// New Route
router.get("/new", isLoggedIn, (ListingController.renderNewForm));

// Show Route
router.get("/:id", wrapAsync(ListingController.showListing));

// Create Route
router.post("/", validateListing, isLoggedIn, wrapAsync(ListingController.createListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));

// Update Route
router.put("/:id", validateListing, isLoggedIn, isOwner, wrapAsync(ListingController.updateListing));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing));

module.exports = router;