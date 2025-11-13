var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SerieSchema = new Schema({
    title: String,
    plot: String,
    rated: String,
    year_start: Number,
    year_end: Number,
    released: Date,
    runtime: String,
    genre: [String],
    director: [String],
    writer: [String],
    actors: [String],
    actors: [String],
    language: [String],
    country: [String],
    awards: String,
    metascore: Number,
    imdbRating: Number,
    imdbVotes: Number
});

module.exports = mongoose.model('Serie', SerieSchema);
