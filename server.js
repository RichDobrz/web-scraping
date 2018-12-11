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

app.get("/scrape", function(req, res) {
  axios.get("https://apnews.com/apf-lifestyle")
    .then((response) => {
      let $ = cheerio.load(response.data)

      $(".FeedCard").each((i, element) => {
        let result = {}
        

          result.title = $(element).children(".CardHeadline").children(".headline").children("h1").text()
          result.link = $(element).children(".CardHeadline").children(".headline").attr("href")
          result.summary = $(element).children(".content-container").children(".content").children("p").text()



          db.Article.create(result)
          .then((dbArticle) => {
            console.log(dbArticle)
          })
          .catch((err) => {
            return res.json(err)
          })
      })
      res.send("Scrape Complete")
    })
})

app.get("/articles", (req, res) => {
  db.Article.find({})
  .then((dbArticle) => {
    res.json(dbArticle)
  })
  .catch((err) => {
    res.json(err)
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