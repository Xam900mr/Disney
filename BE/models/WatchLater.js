var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WatchLaterSchema = new Schema({
    email: {type: String, required: true},
    movie: { type: Schema.Types.ObjectId, ref: 'Movie', default: null },
    series: { type: Schema.Types.ObjectId, ref: 'Serie', default: null },
    added_at: { type: Date, default: Date.now }
});

WatchLaterSchema.pre('validate', function(next) {
  const hasMovie = !!this.movie;
  const hasSeries = !!this.series;

  if (!hasMovie && !hasSeries) {
    return next(new Error('Debe proporcionar movie o series'));
  }
  if (hasMovie && hasSeries) {
    return next(new Error('Proporciona solo movie o solo series'));
  }
  next();
});

// Evitar duplicados por usuario + contenido
WatchLaterSchema.index(
  { email: 1, movie: 1 },
  { unique: true, sparse: true }
);

WatchLaterSchema.index(
  { email: 1, series: 1 },
  { unique: true, sparse: true }
);

module.exports = mongoose.model('WatchLater', WatchLaterSchema, 'watchlater');
