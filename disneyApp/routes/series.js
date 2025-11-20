var express = require('express');
var router = express.Router();
const Serie = require('../models/Serie');

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
