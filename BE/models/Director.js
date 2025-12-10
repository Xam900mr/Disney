var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DirectorSchema = new Schema({
    name: String,
    films:{ type: Schema.ObjectId, ref: 'Movie' },
    tvshows: [String],
});

module.exports = mongoose.model('Director', DirectorSchema, 'directors');