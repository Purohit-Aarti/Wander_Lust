const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",
        populate: {
            path: "author",
        },
    }).populate("owner");
    if(!listing) {
        req.flash("error", "Listing you are looking for doesn't exists!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async (req, res, next) => {
    // to validate schema, if-conditions are used, i.e. a messier task!
    // hence joi is used.
    // if(!req.body.listing) {
    //     next(new ExpressError(400, "send valid data for listing!"));
    // }
    // if(!req.body.listing.title) {
    //     next(new ExpressError(400, "Title is required!"));
    // }
    // if(!req.body.listing.description) {
    //     next(new ExpressError(400, "Description is required!"));
    // }

    
    // receiving data in an object format
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // logged in user will be the owner!
    await newListing.save();
    req.flash("success", "New listing created");
    // console.log("Data was inserted");
    res.redirect("/listings");

    // receiving data in normal format
    // let {title, description, image, price, location, country} = req.body;
    // await Listing.insertMany({
    //     title: title,
    //     description: description,
    //     image: image,
    //     price: price,
    //     location: location,
    //     country: country,
    // });
}

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you are looking for doesn't exists!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    if(!req.body.listing) {
        next(new ExpressError(400, "send valid data for listing!"));
    }
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing is updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing is deleted!");
    res.redirect("/listings");
}