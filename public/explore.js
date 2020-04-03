
function triggercross(val) {
    var val = document.getElementById("search");
    var x = document.getElementById("closeid");
    x.style.display = "block";
}

function close1() {
    var x = document.getElementById("closeid");
    if (x.style.display == "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }

}

// function searchFunction() {
//     var input, filter, ul, li, a, i;
//     input = document.getElementById('search').value;
//     filter = input.value.toUpperCase();
//     ul = document.getElementById('wrapper');
//     li = ul.getElementsByClassName('li-name');

//     for (i = 0; i < li.length; i++) {
//         a = li[i].getElementsByTagName('p')[0];
//         if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
//             li[i].style.display = "";
//         }

//         else {
//             li[i].style.display = 'none';
//         }
//     }
// }

function changebutton(x) {
    x.classList.toggle("tabcontent1");
}
function changetheme() {
    var body = document.body;
    body.classList.toggle("light");
    // body.classList.remove("dark");
    // body.classList.add("light");
    // body.classList.replace("dark", "light");
}
// var userschema = new mongoose.Schema({
//     city: String
// })
// var user = mongoose.model('userprofile',
//     userschema);

// function addtouserprofile() {
//     app.post("/explore/#", function (req, res) {
//         var city = req.body.city;
//         user.create(city, function (err,new ) {
//             if (err) { console.log(err); }
//             else { res.redirect("/explore/") }
//         })
//     }

function loadingscreen() {
    var x = document.getElementById("buynow");
    x.style.display = "block";
}
