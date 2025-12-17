var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
  movie_title: String,
  release_date: String,
  hero: String,
  villian: String,
  song: String
});   

module.exports = mongoose.model('Character', MovieSchema, 'characters');