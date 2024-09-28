const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsyn.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");
const {validateReview} = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js");


// Reviews

// create Route
router.post("/", validateReview, isLoggedIn, wrapAsync(ReviewController.createReview));

// delete Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(ReviewController.destroyReview));

module.exports = router;