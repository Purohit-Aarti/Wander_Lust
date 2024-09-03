const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        //if the img is undefined (when no value is passed)
        default: "https://wallup.net/wp-content/uploads/2017/03/29/486676-astronaut-sitting-space-Earth.jpg",
        //mongoosejs.com/schema/virtuals
        //when the img value is provided but empty
        set: (v) => v === ""? "https://wallup.net/wp-content/uploads/2017/03/29/486676-astronaut-sitting-space-Earth.jpg" : v,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;