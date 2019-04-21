var express = require("express");
var firebase = require("firebase");
var bodyParser = require("body-parser");
var url = require("url");
var User = require("./User.js");
var port = process.env.PORT || 3000;
var path = require("path");
var app = express();

app.use(express.static(path.join(__dirname, "static")));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

const config = JSON.parse(process.env.firebaseConfig);
firebase.initializeApp(config);

app.get("/", async function(req, res) {
  let user = new User("Yatharth", "Rawat");
  console.log(await user.PushToUserDatabase());
  res.sendFile(__dirname + "/static/LoginScreen.html");
});

app.get("/Meet", function(req, res) {
  res.sendFile(__dirname + "/static/Meet.html");
});

app.get("/FindMovieData", function(req, res) {
  res.send(req.query.search);
});

app.get("/FindMovie", function(req, res) {
  res.sendFile(__dirname + "/static/FindMovie.html");
});

app.get("/Home", function(req, res) {
  res.sendFile(__dirname + "/static/Home.html");
});

app.post("/Invite", function(req, res) {
  let database = firebase.database();
  let dbRef = database.ref();
  let emailId = req.body.email;
  let InviteRef = dbRef.child("Invites").child(emailId);

  InviteRef.once("value", function(snapshot) {
    // For Each Snapshort Resolve Promise Firebase does not know if there is only entry after search
    snapshot.forEach(function(childSnapshot) {
      let value = childSnapshot.val();
      console.log(value);
    });
  });
});

// Open Loading Screen after getting coordinates
app.post("/Meet", function(req, res) {
  // Put Coordinate and Movie in the Database along with User Name
  let database = firebase.database();
  let dbRef = database.ref();
  let movie = req.body.movie;
  let emailId = req.body.email;
  let coordinates = req.body.coordinates;

  // Get Node with all users
  let MovieRef = dbRef.child("Movie").child(movie);
  // Order List by EmailId and search for email id of user
  var MovieInfo = {
    Movie: movie,
    EmailId: emailId,
    Coordinates: coordinates,
    Seen: null
  };
  MovieRef.orderByChild("EmailId")
    .equalTo(emailId)
    .once("value", function(snapshot) {
      let movieKey = null;
      if (!snapshot.exists()) {
        movieKey = MovieRef.push().key;
      } else {
        movieKey = Object.keys(snapshot.val())[0]; // Unique for the particular movie entry generated by firebase
      }
      let movieObject = {};
      movieObject["/Movie/" + movie + "/" + movieKey] = MovieInfo;
      // Update the Movie enteries
      firebase
        .database()
        .ref()
        .update(movieObject, function() {
          console.log("Movie Details Updated/Added Successfully");
        });
    });

  let Url = url.format({
    pathname: "/Meet",
    query: {
      email: emailId,
      movie: movie
    }
  });

  // Go to Meet.html
  res.json({ redirect: Url });
});

app.listen(port, function() {
  console.log(`Example app listening on port ` + port);
});
