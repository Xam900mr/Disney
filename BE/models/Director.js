var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DirectorSchema = new Schema({
    name: String,
    films: [String],
    shortfilms: [String],
    tvshows: [String],
});

module.exports = mongoose.model('Director', DirectorSchema, 'Disney');