var express = require("express");
var router = express.Router();
var auth = require("../config/auth");
var isAdmin = auth.isAdmin;

var Tutor = require("../models/tutors");
var Category = require("../models/category");
var User = require("../models/user");
var Wishlist = require("../models/wishlist");
var My_purchase = require("../models/purchases")

router.get('/wishlist', function (req, res) {
    var name = req.user.name;
    var count;
    Wishlist.count({ user: name }, function (err, c) {

        count = c;

    });

    Wishlist.find({ user: name }, function (err, tutors) {
        res.render('wishlist', {
            tutors: tutors,
            count: count,
            currentuser: req.user, type: "Wishlist"
        });

    });
})

router.get("/delete_profile/:id", function (req, res) {
    Wishlist.findByIdAndRemove(req.params.id, function (err) {

        if (err)
            return console.log(err);
        req.flash("success", "profile deleted");
        res.redirect("/user/wishlist");

    });
});

router.get('/mypurchases', function (req, res) {
    var name = req.user.name;
    var count;
    My_purchase.count({ user: name }, function (err, c) {

        count = c;

    });

    My_purchase.find({ user: name }, function (err, tutors) {
        res.render('wishlist', {
            tutors: tutors,
            count: count,
            currentuser: req.user, type: "My Purchases"
        });

    });
})



module.exports = router;