var mongoose = require("mongoose");

var collectionschema = new mongoose.Schema({
    city: String,
    Category: String
});


module.exports = mongoose.model('City', collectionschema, 'cities');