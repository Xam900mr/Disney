var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CharacterMoviesSchema = new Schema({
  pelicula_titulo: String,
  pelicula_ano: Number,
  pelicula_genero: String,
  pelicula_tipo: String,
  pelicula_poster: String,
  personaje_id: String,
  personaje_nombre: String,
  personaje_tipo: String,
  personaje_edad: String,
  personaje_genero: String,
  personaje_descripcion: String,
  personaje_foto_url: String,
  actor_nombre: String,
  cancion_principal: String
});

CharacterMoviesSchema.statics.findByName = function(name) {
  return this.findOne({ personaje_nombre: name });
};

module.exports = mongoose.model('Character_Movie', CharacterMoviesSchema, 'characters1');