const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const User = require("./user");
const { string } = require("joi");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        // type: String,
        // //if the img is undefined (when no value is passed)
        // default: "https://th.bing.com/th/id/R.91c4f71a6f3c768cdb0eac2fded67475?rik=BbEp%2br4h5aDhIA&riu=http%3a%2f%2fthumbs.dreamstime.com%2fz%2fmy-home-599091.jpg&ehk=tndcoU57xiChCAG9OTqTOJ0%2bKImGEW%2f0EHficdPVGXI%3d&risl=&pid=ImgRaw&r=0",
        // //mongoosejs.com/schema/virtuals
        // //when the img value is provided but empty
        // set: (v) => v === ""? "https://th.bing.com/th/id/R.91c4f71a6f3c768cdb0eac2fded67475?rik=BbEp%2br4h5aDhIA&riu=http%3a%2f%2fthumbs.dreamstime.com%2fz%2fmy-home-599091.jpg&ehk=tndcoU57xiChCAG9OTqTOJ0%2bKImGEW%2f0EHficdPVGXI%3d&risl=&pid=ImgRaw&r=0" : v,
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],   
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;