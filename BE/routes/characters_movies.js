var express = require('express');
var router = express.Router();
const Character_Movie = require('../models/Character_Movies');

// Get all characters
router.get('/', function(req, res, next) {
  Character_Movie.find()
    .then(function(characters) {
      return res.status(200).json(characters);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});

// Get character by id
router.get('/:id', function(req, res, next) {
  Character_Movie.findById(req.params.id)
    .then(function(character) {
      if (!character) return res.status(404).send({ message: 'Character not found' });
      return res.status(200).json(character);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});

router.get('/name/:name', function(req, res, next) {
  Character_Movie.findByName(req.params.name)
    .then(function(character) {
      if (!character) return res.status(404).send({ message: 'Character not found' });
      return res.status(200).json(character);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});

// Create new character
router.post('/', function(req, res, next) {
  Character_Movie.create(req.body)
    .then(function(character) {
      return res.status(201).json(character);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});

// Delete character by id
router.delete('/:id', function(req, res, next) {
  Character_Movie.findByIdAndRemove(req.params.id)
    .then(function() {
      return res.sendStatus(204);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});


module.exports = router;
