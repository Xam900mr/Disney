var express = require('express');
var router = express.Router();
const Character_Serie = require('../models/Character_Series');

// Get all characters
router.get('/', function(req, res, next) {
  Character_Serie.find()
    .then(function(characters) {
      return res.status(200).json(characters);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});

// Get character by id
router.get('/:id', function(req, res, next) {
  Character_Serie.findById(req.params.id)
    .then(function(character) {
      if (!character) return res.status(404).send({ message: 'Character not found' });
      return res.status(200).json(character);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});

router.get('/name/:name', function(req, res, next) {
  Character_Serie.findByName(req.params.name)
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
  Character_Serie.create(req.body)
    .then(function(character) {
      return res.status(201).json(character);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});

// Delete character by id
router.delete('/:id', function(req, res, next) {
  Character_Serie.findByIdAndRemove(req.params.id)
    .then(function() {
      return res.sendStatus(204);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});


module.exports = router;
