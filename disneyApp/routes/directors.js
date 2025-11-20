var express = require('express');
var router = express.Router();
const Director = require('../models/Director');

// Get all directors
router.get('/', function(req, res, next) {
  Director.find()
    .then(function(directors) {
      return res.status(200).json(directors);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});

// Get director by id
router.get('/:id', function(req, res, next) {
  Director.findById(req.params.id, function(err, director) {
    if (err) return res.status(500).send(err);
    if (!director) return res.status(404).send({ message: 'Director not found' });
    return res.status(200).json(director);
  });
});

// Create new director
router.post('/', function(req, res, next) {
  Director.create(req.body, function(err, director) {
    if (err) return res.status(500).send(err);
    return res.status(201).json(director);
  });
});

// Delete director by id
router.delete('/:id', function(req, res, next) {
  Director.findByIdAndRemove(req.params.id, function(err) {
    if (err) return res.status(500).send(err);
    return res.sendStatus(204);
  });
});

module.exports = router;
