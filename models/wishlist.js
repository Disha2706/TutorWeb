var mongoose = require("mongoose");

var wishlistschema = new mongoose.Schema({
    Title: String,
    By: String,
    imgpath: String,
    feesold: String,
    feesnew: String,
    location: String,
    city: String,
    phoneno: String,
    date: String,
    about: String,
    tags: String,
    category: String,
    link: String,
    stars: String,
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tutor"
    },
    user: String

})

module.exports = mongoose.model("Wishlist", wishlistschema, "wishlist");