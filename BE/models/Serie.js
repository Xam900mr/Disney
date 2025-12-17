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
    writer: [String],
    language: [String],
    country: [String],
    awards: String,
    imdb_rating: Number,
    portada_url: String,
    tmdb_id: Number,
    backdrop_url: String,
    trailer_url: String,
});

module.exports = mongoose.model('Serie', SerieSchema, 'series');
