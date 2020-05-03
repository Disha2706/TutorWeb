var mongoose = require("mongoose");

var tutorschema = new mongoose.Schema({
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


    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
})

module.exports = mongoose.model("Tutor", tutorschema, "tutors");