var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FavoriteSchema = new Schema({
    email: String,
    id: String,
    addAt: Date

});

module.exports = mongoose.model('Favorite', FavoriteSchema);