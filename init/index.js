const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
    .then(() => {
        console.log("Connected to DB...");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ // to add a new field into the  schema -> owner
        ...obj, owner: '66f6adeac34329db2b348681'
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized!");
};

initDB();