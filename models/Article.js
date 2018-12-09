
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
 title: {
    type: String,
    trim: true,
    required: "Title is Required"
  },
 summary: {
    type: String,
    trim: true,
 },
 link: {
    type: String,
    trim: true,
    required: "Link is Required"
  },
  saved: {
    type: Boolean,
    default: false
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;