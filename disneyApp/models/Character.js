var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CharacterSchema = new Schema({
    name: String,
    films: [String],
    shortfilms: [String],
    tvshows: [String],
    videogames: [String],
    parkAttraction: String,
    allies: [String],
    enemies: [String],
    createdAt: Date
});

module.exports = mongoose.model('Character', CharacterSchema);