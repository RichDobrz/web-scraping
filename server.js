const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const exphbs = require('express-handlebars');
const mongoose = require('mongoose'); 
const logger = require("morgan");

const db = require("./models");

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/articles";
mongoose.connect(MONGODB_URI)


app.get("/articles-json", function(req, res) {

  db.Article.find()
    .then(function(dbArticle) {
      res.json(dbArticle)
    })
    .catch(function(err) {
        res.json(err)
    })
});

app.get("/articles", function(req, res) {

  db.Article.find({saved: false}).sort( {"_id": -1}).limit(100)
       .then(articles => {
         res.render("index", {article: articles})
       })
       .catch(function(err) {
        console.log(err.message);
      });
});

app.get("/scrape", function(req, res) {
  axios.get("https://apnews.com/apf-lifestyle").then(function(response) {
    const $ = cheerio.load(response.data)

    $(".WireStory").each(function(i, element) {
      let result = {}
      
      result.title = $(this).children(".CardHeadLine").children("a").find("h1").text()
      result.link = $(this).children(".CardHeadLine").children("a").find("h1").attr("href")
      result.summary = $(this).children("a").children(".content").find("p").text()

      db.Article.create(result)
      .then(function(dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        return res.json(err);
      });

    })
  })
})



app.get('/', function(req, res) {
  res.redirect("/articles")
});

// Setup port
var PORT = process.env.PORT || 3000
app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});