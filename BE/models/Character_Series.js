var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CharacterSeriesSchema = new Schema({
  serie_nombre: String,
  personaje_nombre: String,
  personaje_edad: String,
  personaje_genero: String,
  personaje_descripcion: String,
  personaje_foto_url: String,
  actor_nombre: String
});   

module.exports = mongoose.model('Character_Serie', CharacterSeriesSchema, 'characterSeries');