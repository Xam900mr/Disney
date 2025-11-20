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

// GET /movies/:id
router.get('/:id', async function(req, res) {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    return res.status(200).json(movie);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /movies
router.post('/', async function(req, res) {
  try {
    const movie = await Movie.create(req.body);
    return res.status(201).json(movie);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /movies/:id
router.delete('/:id', async function(req, res) {
  try {
    const result = await Movie.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Movie not found' });
    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
