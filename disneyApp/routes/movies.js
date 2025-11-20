var express = require('express');
var router = express.Router();
const Movie = require('../models/Movie');

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

// Get movie by id
router.get('/:id', function(req, res, next) {
  Movie.findById(req.params.id, function(err, movie) {
    if (err) return res.status(500).send(err);
    if (!movie) return res.status(404).send({ message: 'Movie not found' });
    return res.status(200).json(movie);
  });
});

// Create new movie
router.post('/', function(req, res, next) {
  Movie.create(req.body, function(err, movie) {
    if (err) return res.status(500).send(err);
    return res.status(201).json(movie);
  });
});

// Delete movie by id
router.delete('/:id', function(req, res, next) {
  Movie.findByIdAndRemove(req.params.id, function(err) {
    if (err) return res.status(500).send(err);
    return res.sendStatus(204);
  });
});

module.exports = router;
