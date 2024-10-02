const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyn.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const ListingController = require("../controllers/listings.js");


router.route("/")
.get(wrapAsync(ListingController.index)) // Index Route
.post(isLoggedIn, upload.single("listing[image]"),validateListing, wrapAsync(ListingController.createListing)); // Create Route

// New Route
router.get("/new", isLoggedIn, (ListingController.renderNewForm));

router.route("/:id")
.get(wrapAsync(ListingController.showListing)) // Show Route
.put(upload.single("listing[image]"), isLoggedIn, validateListing, isOwner, wrapAsync(ListingController.updateListing)) // Update Route
.delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing)); // Delete Route


// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm)); 


module.exports = router; 