const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require('path');
const methodOverrride = require("method-override")
const ejsMate = require("ejs-mate");

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

// Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show Route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// Create Route
app.post("/listings", async (req, res) => {
    // let {title, description, image, price, location, country} = req.body;
    // await Listing.insertMany({
    //     title: title,
    //     description: description,
    //     image: image,
    //     price: price,
    //     location: location,
    //     country: country,
    // });

    // receiving data in an object format
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log("Data was inserted");
    res.redirect("/listings");
});

// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

// Update Route
app.put("/listings/:id", async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

// Delete Route
app.delete("/listings/:id", async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});




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

app.listen(8080, () => {
    console.log(`Server is listening to port: ${8080}`);
});