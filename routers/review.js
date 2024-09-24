const express = require("express");
const router = express.Router({mergeParams:true});
const {reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsyn.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((ele) => ele.message).join(",");
        next(new ExpressError(400, errMsg));
    }
    else {
        next();
    }
}


// Reviews

// create Route
router.post("/", validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New review is added");
    res.redirect(`/listings/${listing._id}`);
}));

// delete Route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    req.flash("success", "Review is deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;