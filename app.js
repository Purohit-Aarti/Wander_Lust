if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
    // console.log(process.env.SECRET);
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const methodOverrride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routers/listing.js");
const reviewRouter = require("./routers/review.js");
const userRouter = require("./routers/user.js");

// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("Connected to DB...");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");

// to use it even from the parent directory
app.set("views",path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverrride("_method"));
app.engine('ejs', ejsMate);

// to serve static files like- css, js
app.use(express.static(path.join(__dirname, "public")));

// session storage
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.secret,
    },
    touchAfter: 24 * 36000,
});

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE", error);
});

const sessionOptions = {
    store,
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // security purpose
    },
};

// app.get("/", (req, res) => {
//     res.send("Hey, I'm a Root!");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    if (req.user) {
        console.log(req.user);
        res.locals.currUser = req.user;
    } else {
        console.log("User is not authenticated");
        res.locals.currUser = null;
    }
    next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

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
