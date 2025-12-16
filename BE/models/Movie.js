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
    language: [String],
    country: [String],
    awards: String,
    metascore: Number,
    imdb_rating: Number,
    portada_url: String,
    trailer_url: String,
    backdrop_url: String,
    tagline: String
});

module.exports = mongoose.model('Movie', MovieSchema, 'movies');