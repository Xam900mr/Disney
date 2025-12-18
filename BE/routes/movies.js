var express = require('express');
var router = express.Router();
const Movie = require('../models/Movie');
var mongoose = require('mongoose');

// Token generation imports
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

//models
var User = require('../models/User.js');

mongoose.set("strictQuery", false);
var db = mongoose.connection;

const debug = console.log;

function tokenVerify(req, res, next) {
  var authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).send({ ok: false, message: 'No token provided.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).send({ ok: false, message: 'Token format invalid.' });

  const retrievedToken = parts[1];
  jwt.verify(retrievedToken, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).send({ ok: false, message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id;
    next();
  });
}

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
