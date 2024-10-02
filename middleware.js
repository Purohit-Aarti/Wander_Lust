const Listing = require("./models/listing");
const {listingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req); req obj stores many useful data!
    console.log(req.user); // if user is logged in, user info is saved here
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please log in to continue!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You're not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//using joi for schema validation
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((ele) => ele.message).join(",");
        next(new ExpressError(400, errMsg));
    }
    else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((ele) => ele.message).join(",");
        next(new ExpressError(400, errMsg));
    }
    else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    console.log(res.locals.currUser);
    console.log(res.locals.currUser._id);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You're not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};