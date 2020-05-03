var mongoose = require("mongoose");

var wishlistschema = new mongoose.Schema({
    Title: String,
    By: String,
    imgpath: String,
    feesold: String,
    feesnew: String,
    date: String,
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tutor"
    },
    user: String

})

module.exports = mongoose.model("Purchases", wishlistschema, "purchases");