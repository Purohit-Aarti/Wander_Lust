const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require('path');
const methodOverrride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsyn.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

main()
    .then(() => {
        console.log("Connected to DB...");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine", "ejs");

// to use it even from the parent directory
app.set("views",path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverrride("_method"));
app.engine('ejs', ejsMate);

// to serve static files like- css, js
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.send("Hey, I'm Root!");
});

//using joi for schema validation
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    console.log(result);
    if(error) {
        let errMsg = error.details.map((ele) => ele.message).join(",");
        next(new ExpressError(400, errMsg));
    }
    else {
        next();
    }
}
    


// Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

// Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
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
    await newListing.save();
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
}));

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    if(!req.body.listing) {
        next(new ExpressError(400, "send valid data for listing!"));
    }
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete("/listings/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


// Testing
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Sample place",
//         description: "Hi, this is a sample listing for my project  - wanderlust",
//         price: 1400,
//         location: "Rajasthan",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successfull testing!");
// });


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message, statusCode});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log(`Server is listening to port: ${8080}`);
});