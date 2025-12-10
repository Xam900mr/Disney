var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FavoriteSchema = new Schema({
    email: {type: String, required: true},
    movie: { type: Schema.Types.ObjectId, ref: 'Movie', default: null },
    series: { type: Schema.Types.ObjectId, ref: 'Serie', default: null },
    id: String,
    added_at: { type: Date, default: Date.now }

});

FavoriteSchema.pre('validate', function(next) {
  if (!this.movie && !this.series) {
    return next(new Error('Debe proporcionar movie o series'));
  }
  next();
});

module.exports = mongoose.model('Favorite', FavoriteSchema, 'favorites');