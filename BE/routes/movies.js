var express = require('express');
var router = express.Router();
const Movie = require('../models/Movie');

const { tokenVerify } = require('../auth');

// Get all movies
router.get('/', function(req, res, next) {
  Movie.find()
    .then(function(movies) {
      return res.status(200).json(movies);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});

// Buscar películas por texto parcial
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;

    const movies = await Movie.find({
      title: { $regex: query, $options: 'i' } // i = ignore case
    }).limit(20);

    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get movie by title
router.get('/title/:title', function (req, res) {
  Movie.findOne({
    title: { $regex: `^${req.params.title}$`, $options: 'i' }
  })
    .then(function (movie) {
      if (!movie)
        return res.status(404).json({ message: 'Movie not found' });

      return res.status(200).json(movie);
    })
    .catch(function (err) {
      return res.status(500).json({ error: err.message });
    });
});

// Get movie by id
router.get('/:id', function(req, res, next) {
  Movie.findById(req.params.id)
    .then(function(movie) {
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
      return res.status(200).json(movie);
    })
    .catch(function(err) {
      return res.status(500).json({ error: err.message });
    });
});

// Crear nueva película
router.post('/', tokenVerify, function(req, res, next) {
  Movie.create(req.body)
    .then(movie => res.status(201).json(movie))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Borrar película
router.delete('/:id', tokenVerify, function(req, res, next) {
  Movie.findByIdAndRemove(req.params.id)
    .then(result => {
      if (!result) return res.status(404).json({ message: 'Movie not found' });
      return res.sendStatus(204);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});


module.exports = router;
