var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
    title: String,
    plot: String,
    rated: String,
    year: Number,
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

module.exports = mongoose.model('Movie', MovieSchema, 'movies');