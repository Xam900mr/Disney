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
  Movie.findById(req.params.id)
    .then(function(movie) {
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
      return res.status(200).json(movie);
    })
    .catch(function(err) {
      return res.status(500).json({ error: err.message });
    });
});

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


// Create new movie
router.post('/', function(req, res, next) {
  Movie.create(req.body)
    .then(function(movie) {
      return res.status(201).json(movie);
    })
    .catch(function(err) {
      return res.status(500).json({ error: err.message });
    });
});

// Delete movie by id
router.delete('/:id', function(req, res, next) {
  Movie.findByIdAndRemove(req.params.id)
    .then(function(result) {
      if (!result) return res.status(404).json({ message: 'Movie not found' });
      return res.sendStatus(204);
    })
    .catch(function(err) {
      return res.status(500).json({ error: err.message });
    });
});

module.exports = router;
