var express = require("express");
var router = express.Router();
// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

var auth = require("../config/auth");

var cities = require("../models/city");
var categories = require("../models/category");
var tutors = require("../models/tutors");
var Wishlist = require("../models/wishlist");
var My_Purchases = require("../models/purchases");

router.get("/:id", function (req, res) {
    tutors.findById(req.params.id).populate("comments").exec(function (err, tutors) {

        res.render("show", { tutors: tutors, currentuser: req.user });
    })
});
router.post("/:id", function (req, res) {
    // if (req.body.comment) {
    tutors.findById(req.params.id, function (err, tutors) {
        if (err)
            console.log(err);
        else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err)
                    console.log(err);
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    tutors.comments.push(comment);
                    tutors.save();
                    res.redirect("/" + tutors._id);
                }
            })
        }
    })
});

router.get("/:id/checkout", async (req, res) => {
    tutors.findById(req.params.id).populate("comments").exec(async (err, tutors) => {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: tutors.feesnew * 100,
                currency: 'inr',
                // Verify your integration in this guide by including this parameter
                metadata: { integration_check: 'accept_a_payment' },
            });
            const { client_secret } = paymentIntent;
            res.render("checkout", { tutors: tutors, client_secret, currentuser: req.user });
        }
        catch (err) {
            req.flash("error", err.message);
            req.redirect("/show/:id");

        }
    })
});

router.post("/:id/addtolist", function (req, res) {
    tutors.findById(req.params.id, function (err, tutors) {
        if (err)
            console.log(err);
        else {
            var Title = tutors.Title;
            var By = tutors.By;
            var feesold = tutors.feesold;
            var feesnew = tutors.feesnew;
            var location = tutors.location;
            var city = tutors.city;
            var phone = tutors.phone;
            var date = tutors.date;
            var about = tutors.about;
            var tags = tutors.tags;
            var link = tutors.link;
            var category = tutors.category;
            var name = req.user.name;
            var imageFile = tutors.imgpath;
            var id = tutors._id;
            var tutor = new Wishlist({

                Title: Title,
                By: By, feesold: feesold, feesnew: feesnew, location: location, city: city, phone: phone, date: date, about: about,
                tags: tags, link: link,
                imgpath: imageFile, category: category, id: id, user: name
            });
            tutor.save();
            res.redirect("/show/" + tutors._id);
        }
        // }
    })


});
router.get("/:id/purchase", function (req, res) {
    tutors.findById(req.params.id, function (err, tutors) {
        var d = new Date();
        console.log(d);
        if (err)
            console.log(err);
        else {
            var Title = tutors.Title;
            var By = tutors.By;
            var feesold = tutors.feesold;
            var feesnew = tutors.feesnew;
            var date = d;
            var name = req.user.name;
            var imageFile = tutors.imgpath;
            var id = tutors._id;
            var tutor = new My_Purchases({

                Title: Title,
                By: By, feesold: feesold, feesnew: feesnew, date: date,
                imgpath: imageFile, id: id, user: name
            });
            tutor.save();
            res.redirect("/show/" + tutors._id);
        }

    })
});

module.exports = router;
