var express = require("express");
var router = express.Router();
var mkdirp = require("mkdirp");
var fs = require("fs-extra");
var resizeImg = require("resize-img");
var auth = require("../config/auth");
var isAdmin = auth.isAdmin;

var Tutor = require("../models/tutors");
var Category = require("../models/category");
var User = require("../models/user");


router.get('/', function (req, res) {

    var name = req.user.name;
    Tutor.count(function (err, c) {

        count = c;

    });
    if (!isAdmin) {
        res.render("profile1");

    }
    else {

        Tutor.find({ By: name }, function (err, tutors) {
            res.render('profile', {
                tutors: tutors,
                count: count,
                currentuser: req.user, type: "Tutor Mode"
            });

        });
    }
});


router.get("/add_tutor", function (req, res) {
    var Title = "";
    var feesold = "";
    var feesnew = "";
    var location = "";
    var city = "";
    var phoneno = "";
    var date = "";
    var about = "";
    var tags = "";
    var link = "";

    Category.find(function (err, categories) {
        res.render("add_profile", {
            Title: Title, categories: categories, feesold: feesold, feesnew: feesnew, location: location, city: city, phoneno: phoneno, date: date, about: about,
            tags: tags, link: link, currentuser: req.user, type: "Add Tutor"
        });
    });
});

router.post("/add_tutor", function (req, res) {
    var Title = req.body.Title;
    var By = req.user.name;
    var feesold = req.body.feesold;
    var feesnew = req.body.feesnew;
    var location = req.body.location;
    var city = req.body.city;
    var phoneno = req.body.phoneno;
    var date = req.body.date;
    var about = req.body.about;
    var tags = req.body.tags;
    var link = req.body.link;
    var category = req.body.category;
    console.log(category);

    if (!req.files) { imageFile = ""; }

    if (req.files) {

        var imageFile = typeof (req.files.imgpath) !== "undefined" ? req.files.imgpath.name : "";

    }
    req.checkBody("Title", "Title is required").notEmpty();
    req.checkBody('feesold', 'Price must have value').isDecimal();
    req.checkBody('feesnew', 'Price must have value').isDecimal();
    req.checkBody('imgpath', 'You must upload an image').isImage(imageFile);



    var errors = req.validationErrors();
    if (errors) {
        Category.find(function (err, categories) {
            res.render("add_profile", {
                errors: errors,
                Title: Title, category: category,
                By: By, feesold: feesold, feesnew: feesnew, location: location, city: city, phoneno: phoneno, date: date, about: about,
                tags: tags, link: link, currentuser: req.user,

            });
        });
    }
    else {
        Tutor.findOne({ Title: Title }, function (err, tutor) {


            if (tutor) {
                req.flash("danger", "Title  exists,choose another");
                Category.find(function (err, categories) {
                    res.render("add_profile", {
                        Title: Title, category: category,
                        By: By, feesold: feesold, feesnew: feesnew, location: location, city: city, phoneno: phoneno, date: date, about: about,
                        tags: tags, link: link, currentuser: req.user, type: "Add Tutor"
                    });
                });

            } else {
                var feesold2 = parseFloat(feesold).toFixed(2);
                var feesnew2 = parseFloat(feesnew).toFixed(2);

                var tutor = new Tutor({

                    Title: Title,
                    By: By, feesold: feesold2, feesnew: feesnew2, location: location, city: city, phoneno: phoneno, date: date, about: about,
                    tags: tags, category: category, link: link,
                    imgpath: imageFile

                });
                tutor.save(function (err) {

                    if (err)
                        return console.log(err);

                    /* mkdirp('public/' + tutor._id, function(err){
  
                      return console.log(err);
                    });
                    
                if (imageFile != ""){
                   
                  var tutorImage = req.files.imgpath;
                  var path = 'public' + tutor._id + '/' + imageFile;
  
                  tutorImage.mv(path, function(err){
  
                      return console.log(err);
                  });
  
                } */


                    req.flash('success', 'Tutor added!!');
                    res.redirect('/tutor');
                });
            }
        });
    }


});




router.get("/edit_tutor/:Title", function (req, res) {

    Tutor.findOne({ Title: req.params.Title }, function (err, tutor) {
        if (err)
            return conslog.log(err);


        res.render("edit_profile", {
            Title: tutor.Title, category: tutor.category,
            By: tutor.By, imgpath: tutor.imgpath, feesold: tutor.feesold, feesnew: tutor.feesnew, location: tutor.location, city: tutor.city,
            phoneno: tutor.phoneno, date: tutor.date, about: tutor.about,
            tags: tutor.tags, link: tutor.link,
            id: tutor._id, currentuser: req.user, type: "Edit Tutor"
        });
    });
});

router.post("/edit_tutor/:Title", function (req, res) {
    var Title = req.body.Title;
    var By = req.body.By;
    var image = req.body.image;
    var feesold = req.body.feesold;
    var feesnew = req.body.feesnew;
    var location = req.body.location;
    var city = req.body.city;
    var phoneno = req.body.phoneno;
    var date = req.body.date;
    var about = req.body.about;
    var tags = req.body.tags;
    var link = req.body.link;
    var category = req.body.category;

    if (!req.files) { imageFile = ""; }

    if (req.files) {

        var imageFile = typeof (req.files.image) !== "undefined" ? req.files.image.name : "";

    }
    req.checkBody("Title", "Title is required").notEmpty();
    req.checkBody('feesold', 'Price must have value').isDecimal();
    req.checkBody('feesnew', 'Price must have value').isDecimal();
    req.checkBody('image', 'You must upload an image').isImage(imageFile);



    var errors = req.validationErrors();
    if (errors) {
        res.render("add_profile", {
            Title: Title, category: category,
            By: By, image: image, feesold: feesold, feesnew: feesnew, location: location, city: city, phoneno: phoneno, date: date, about: about,
            tags: tags, link: link, currentuser: req.user, type: "Add Tutor"

        });
    }

    else {
        Tutor.findOne({ Title: Title }, function (err, tutor) {


            if (tutor) {
                req.flash("danger", "Title  exists,choose another");
                res.render("add_profile", {
                    Title: Title, category: category,
                    By: By, image: image, feesold: feesold, feesnew: feesnew, location: location, city: city, phoneno: phoneno, date: date, about: about,
                    tags: tags, link: link, currentuser: req.user
                });


            } else {
                var feesold2 = parseFloat(feesold).toFixed(2);
                var feesnew2 = parseFloat(feesnew).toFixed(2);

                var tutor = new Tutor({

                    Title: Title, category: category,
                    By: By, feesold: feesold2, feesnew: feesnew2, location: location, city: city, phoneno: phoneno, date: date, about: about,
                    tags: tags, link: link,
                    image: imageFile

                });
                tutor.save(function (err) {
                    if (err)
                        return console.log(err);

                    /* mkdirp('public/' + tutor._id, function(err){
  
                      return console.log(err);
                    });
                    
                if (imageFile != ""){
                   
                  var tutorImage = req.files.imgpath;
                  var path = 'public' + tutor._id + '/' + imageFile;
  
                  tutorImage.mv(path, function(err){
  
                      return console.log(err);
                  });
  
                } */


                    req.flash('success', 'Tutor added!!');
                    res.redirect('/tutor');
                });
            }
        });
    }


});



router.get("/delete_tutor/:id", function (req, res) {
    Tutor.findByIdAndRemove(req.params.id, function (err) {

        if (err)
            return console.log(err);
        req.flash("success", "profile deleted");
        res.redirect("/tutor");

    });
});



//Exports
module.exports = router;