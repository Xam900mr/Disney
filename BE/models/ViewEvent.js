var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var  debug = require('debug')("app:models");

var bcrypt = require('bcryptjs');


// models/ViewEvent.js
const ViewEventSchema = new Schema({
  email: { type: String, index: true, required: true },
  contentType: { type: String, enum: ['movie', 'series'], required: true },
  contentId: { type: Schema.Types.ObjectId, required: true, index: true },
  genres: { type: [String], default: [] },
  secondsWatched: { type: Number, default: 0 }, // opcional por ahora
  viewedAt: { type: Date, default: Date.now, index: true },
});
ViewEventSchema.index({ email: 1, viewedAt: -1 });
module.exports = mongoose.model('ViewEvent', ViewEventSchema, 'viewevents');