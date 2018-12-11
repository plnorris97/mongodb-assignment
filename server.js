var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var express = require("express");
var mongojs = require("mongojs");

var PORT = 3000;

// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "newsydb";
var collections = ["articles"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsydb", { useNewUrlParser: true });

// When the server starts, create and save a new User document to the db
// The "unique" rule in the User model's schema will prevent duplicate users from being added to the server

// db.User.create({ 
//     firstname: firstname, 
//     lastname: lastname
// })
//   .then(function(dbUser) {
//     console.log(dbUser);
//   })
//   .catch(function(err) {
//     console.log(err.message);
//   });

// Scrape data from news site and place it into the mongodb db
app.get("/scrape", function(req, res) {

    // Make a request via axios to grab the HTML body from the site of your choice
    axios.get("https://www.behindthesteelcurtain.com/nfl-pittsburgh-steelers-news").then(function(response) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);

        // Select each element in the HTML body from which you want information.
        // NOTE: Cheerio selectors function similarly to jQuery's selectors,
        // but be sure to visit the package's npm page to see how it works
        $(".c-entry-box--compact").each(function(i, element) {
        // Save the text and href of each link enclosed in the current element
        
        var link = $(element).children("a").attr("href");

        // If this found element had both a title and a link
        if (link && title) {
            // Insert the data in the articl db
            db.Articles.insert({
            link: link
            },
            function(err, inserted) {
            if (err) {
                // Log the error if one is encountered during the query
                console.log(err);
            }
            else {
                // Otherwise, log the inserted data
                console.log(inserted);
            }
            });
        }
    });
});
  
// Send a "Scrape Complete" message to the browser
res.send("Scrape Complete");
});

// Routes

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
    res.send("Welcome to Steelers Fan Club News!");
  });


// Route for retrieving all articles from the db
app.get("/articles", function(req, res) {
    // Find all Comments
    db.Articles.find({})
      .then(function(dbArticle) {
        // If all articles are successfully found, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });
  
  
// // Route for retrieving all Comments from the db
// app.get("/comments", function(req, res) {
//   // Find all Comments
//   db.Comment.find({})
//     .then(function(dbComment) {
//       // If all Comments are successfully found, send them back to the client
//       res.json(dbComment);
//     })
//     .catch(function(err) {
//       // If an error occurs, send the error back to the client
//       res.json(err);
//     });
// });

// Route for retrieving all Users from the db
app.get("/user", function(req, res) {
  // Find all Users
  db.User.find({})
    .then(function(dbUser) {
      // If all Users are successfully found, send them back to the client
      res.json(dbUser);
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route for saving a new Note to the db and associating it with a User
app.post("/submit", function(req, res) {
  // Create a new Comment in the db
  db.Comment.create(req.body)
    .then(function(dbComment) {
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.User.findOneAndUpdate({}, { $push: { notes: dbComment._id } }, { new: true });
    })
    .then(function(dbUser) {
      // If the User was updated successfully, send it back to the client
      res.json(dbUser);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route to get all User's and populate them with their comments
app.get("/commenteduser", function(req, res) {
  // Find all users
  db.User.find({})
    // Specify that we want to populate the retrieved users with any associated notes
    .populate("comments")
    .then(function(dbUser) {
      // If able to successfully find and associate all Users and Comments, send them back to the client
      res.json(dbUser);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
