var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    path = require('path'),
    ejs = require("ejs");

mongoose.connect("mongodb://localhost:27017/Tutorweb", { useNewUrlParser: true, useUnifiedTopology: true });
var collectionschema = new mongoose.Schema({
    city: String,
    Category: String
});

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
    link: String,
    stars: String
})

var cities = mongoose.model('city',
    collectionschema,
    'cities');
var categories = mongoose.model('category', collectionschema, 'categories');
var tutors = mongoose.model('tutor', tutorschema, 'tutors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');

app.get("/explore", function (req, res) {
    if (req.query.search || req.query.city) {
        // const regex1 = new RegExp(req.query.city, 'gi');
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        cities.find({}, function (err, cities) {
            if (err) { console.log("Error"); }
            else {
                categories.find({}, function (err, categories) {
                    tutors.find({
                        $or: [
                            { title: regex },
                            { tags: regex },
                            { By: regex },
                            { city: regex },
                            { location: regex }
                            // { location: regex1 },
                            // { city: regex1 }
                        ]
                    }, function (err, tutors) {
                        res.render("demo-Copy", { categories: categories, cities: cities, tutors: tutors });
                    })
                })
                // res.render("demo-Copy", {  });
            }
        })
    }
    else {
        cities.find({}, function (err, cities) {
            if (err) { console.log("Error"); }
            else {
                categories.find({}, function (err, categories) {
                    tutors.find({}, function (err, tutors) {
                        res.render("demo-Copy", { categories: categories, cities: cities, tutors: tutors });
                    })
                })
                // res.render("demo-Copy", {  });
            }
        })
    }
});
app.get("/:id", function (req, res) {
    tutors.findById(req.params.id, function (err, tutors) {
        res.render("show", { tutors: tutors });
    })
});
app.get("/:id/checkout", function (req, res) {
    tutors.findById(req.params.id, function (err, tutors) {
        // const stripe = require('stripe')('sk_test_C1LDhkeWe2q2ROTEeFogev2I00FLeRhNry');

        // const paymentIntent = stripe.paymentIntents.create({
        //     amount: tutors.feesnew,
        //     currency: 'inr',
        //     metadata: { integration_check: 'accept_a_payment' },
        // });
        res.render("checkout", { tutors: tutors });
    })
});

app.post("/submitcity", function (req, res) {
    var selectedcity = { city: req.body.city, name: "city" };
    // user.findOneAndDelete("city");
    // var user = mongoose.model('userprofile',
    //     userschema);
    // res.send("explore");
    user.create(selectedcity, function (err) {
        if (err) { console.log(err); }
        else { res.redirect("/explore") }
    });
})
// app.get("/explore/:id", function (req, res) {
//     res.send("This will be the shoow page one day");
// })

app.get("*", function (req, res) {
    res.send("Error 404, Page Not Found")
});
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
app.listen(3000);