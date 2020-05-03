var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var User = require("./models/user");
var Comment = require("./models/comments");
var cities = require("./models/city");
var categories = require("./models/category");
var tutors = require("./models/tutors");
var expressValidator = require("express-validator");
var path = require("path");
var LocalStrategy = require("passport-local").Strategy;
var passportLocalMongoose = require("passport-local-mongoose");
var config = require("./config/database");
var fileUpload = require("express-fileupload");
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const stripepublickey = process.env.STRIPE_PUBLIC_KEY;
const stripesecretkey = process.env.STRIPE_SECRET_KEY;

mongoose.connect(config.database, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true });

var app = express();
app.set("views", path.join(__dirname + '/views'));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
  secret: "login to tutorweb",
  resave: true,
  saveUninitialized: true
}));
//express validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  },
  customValidators: {
    isImage: function (value, filename) {
      var extension = (path.extname(filename)).toLowerCase();
      switch (extension) {
        case ".jpg":
          return ".jpg";
        case ".png":
          return ".png";
        case ".jpeg":
          return ".jpeg";
        default:
          return false;
      }
    }
  }
}));


//express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()
));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set gobal variables
app.locals.errors = null;

app.use(fileUpload());

/* app.get("*",function(req,res,next){
  res.locals.cart=req.session.cart;
  next();
}); */
//set routes
var profile = require("./routes/profile.js");
var show = require("./routes/show");
var wishlist = require("./routes/list");

app.use("/tutor", profile);
app.use("/show", show);
app.use("/user", wishlist);

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.get("/", function (req, res) {
  if (req.isAuthenticated())
    res.render("homepage", { user: req.user });
  else
    res.render("homepage", { user: "none" });
});



//auth routes

app.get("/register", function (req, res) {
  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dishacheck123@gmail.com',
      pass: 'Disharasika123'
    }
  });
  var mailOptions = {
    from: 'dishacheck123@gmail.com',
    to: 'ldisha2000@gmail.com',
    subject: 'Verify your account',
    text: 'OTP:100056#'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.render("forms", {
    errors: null
  });
});



app.post("/register", function (req, res) {
  var Acc = req.body.accounttype;
  var Uname = req.body.username;
  var Email = req.body.email;
  var Password = req.body.password;
  var Password2 = req.body.password2;

  //Validation

  req.check("username", "Name is required").notEmpty();
  req.check("name", "Name is required").notEmpty();
  req.check("email", "Email is required").notEmpty();
  req.check("email", "Email is not valid").isEmail();
  req.check("password", "Password is required").notEmpty();
  req.check("password", "Password is invalid ").isLength({ min: 8 });
  req.check("password2", "Passwords is not matching").equals(req.body.password);
  req.check("otp", " Enter the OTP sent to your mailid").equals("100056#");
  var errors = req.validationErrors();
  if (errors) {
    res.render("forms", {
      errors: errors
    });
  }
  else {
    if (Acc = "tutor") {
      var newUser = new User({ accounttype: req.body.accounttype, name: req.body.name, username: req.body.username, email: req.body.email, admin: 1 });
      User.register(newUser, req.body.password, function (err, user) {
        if (err) {
          console.log(err);
          return res.render("register");
        }

        passport.authenticate("local")(req, res, function () {
          res.redirect("/");
        });
      });
    } else {
      var newUser = new User({ accounttype: req.body.accounttype, name: req.body.name, username: req.body.username, email: req.body.email, admin: 0 });
      User.register(newUser, req.body.password, function (err, user) {
        if (err) {
          console.log(err);
          return res.render("register");
        }

        passport.authenticate("local")(req, res, function () {
          res.redirect("/");
        });
      });
    }
  }

});

//login forms
app.get("/login", function (req, res) {

  res.render("login");
});


app.post("/login", passport.authenticate("local", {

  successRedirect: "/",
  failureRediect: "/login"
}));

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.get("/aboutus", function (req, res) {
  res.render("aboutus");
})

app.get("/explore", isLoggedIn, function (req, res) {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    cities.find({}, function (err, cities) {
      if (err) { console.log("Error"); }
      else {
        categories.find({}, function (err, categories) {
          tutors.find({
            $or: [
              { Title: regex },
              { tags: regex },
              { By: regex },
              { city: regex },
              { location: regex }
            ]
          }, function (err, tutors) {
            console.log(req.user);
            res.render("explore", { categories: categories, cities: cities, tutors: tutors, currentuser: req.user, category: "none", city: "none" });
          })
        })

      }
    })
  }
  else {
    cities.find({}, function (err, cities) {
      if (err) { console.log("Error"); }
      else {
        categories.find({}, function (err, categories) {
          tutors.find().populate('comments').exec(function (err, tutors) {
            tutors.forEach(function (tutor) {
              for (var i = 0; i < tutor.comments.length; i++)
                console.log(tutor.comments[i].text);
            })
          })
          tutors.find({}, function (err, tutors) {
            res.render("explore", { categories: categories, cities: cities, tutors: tutors, currentuser: req.user, category: "none", city: "none" });
          })
        })
      }
    })
  }
});

app.get("/:category", isLoggedIn, function (req, res) {
  const cat = req.params.category;

  cities.find({}, function (err, cities) {
    if (err) { console.log("Error"); }
    else {
      categories.find({}, function (err, categories) {
        tutors.find({ category: cat }, function (err, tutors) {
          res.render("explore", { categories: categories, cities: cities, tutors: tutors, currentuser: req.user, category: cat, city: "none" });
        })
      })
    }
  })
});
app.get("/explore/:city", isLoggedIn, function (req, res) {
  const city = req.params.city;

  cities.find({}, function (err, cities) {
    if (err) { console.log("Error"); }
    else {
      categories.find({}, function (err, categories) {
        tutors.find({
          $or: [
            { city: city },
            { location: city }
          ]
        }, function (err, tutors) {
          res.render("explore", { categories: categories, cities: cities, tutors: tutors, currentuser: req.user, category: "none", city: city });
        })
      })
    }
  })

});

app.get("/:category/:city", isLoggedIn, function (req, res) {
  const city = req.params.city;
  const cat = req.params.category;
  cities.find({}, function (err, cities) {
    if (err) { console.log("Error"); }
    else {
      categories.find({}, function (err, categories) {
        tutors.find({
          $or: [
            { city: city },
            { location: city }
          ], category: cat
        }, function (err, tutors) {
          res.render("explore", { categories: categories, cities: cities, tutors: tutors, currentuser: req.user, category: cat, city: city });
        })
      })
    }
  })

});


function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.listen(3000, function () {
  console.log("server started");
});