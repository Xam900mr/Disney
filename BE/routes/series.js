var express = require('express');
var router = express.Router();
const Serie = require('../models/Serie');
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

// Get all series
router.get('/', function(req, res, next) {
  Serie.find()
    .then(function(series) {
      return res.status(200).json(series);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});

router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;

    const series = await Serie.find({
      title: { $regex: query, $options: 'i' }
    }).limit(20);

    res.json(series);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/title/:title', function (req, res) {
  Serie.findOne({
    title: { $regex: `^${req.params.title}$`, $options: 'i' }
  })
    .then(function (serie) {
      if (!serie)
        return res.status(404).json({ message: 'Serie not found' });

      return res.status(200).json(serie);
    })
    .catch(function (err) {
      return res.status(500).json({ error: err.message });
    });
});

// Get serie by id
router.get('/:id', function(req, res, next) {
  Serie.findById(req.params.id)
    .then(function(serie) {
      if (!serie) return res.status(404).send({ message: 'Series not found' });
      return res.status(200).json(serie);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});


// Create new serie
router.post('/', function(req, res, next) {
  Serie.create(req.body)
    .then(function(serie) {
      return res.status(201).json(serie);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});

// Delete serie by id
router.delete('/:id', function(req, res, next) {
  Serie.findByIdAndRemove(req.params.id)
    .then(function() {
      return res.sendStatus(204);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});

module.exports = router;
