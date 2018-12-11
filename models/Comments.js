
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
 title: {
    type: String,
    trim: true,
    required: "Title Required"
  },
 message: {
    type: String,
    trim: true,
    required: "Message Required"
  },
    createdDate: {
    type: Date,
    default: Date.now
  }
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;