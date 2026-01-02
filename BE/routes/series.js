var express = require('express');
var router = express.Router();
const Serie = require('../models/Serie');
const { tokenVerify } = require('../auth');

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

// Crear serie
router.post('/', tokenVerify, function(req, res, next) {
  Serie.create(req.body)
    .then(serie => res.status(201).json(serie))
    .catch(err => res.status(500).send(err));
});

// Borrar serie
router.delete('/:id', tokenVerify, function(req, res, next) {
  Serie.findByIdAndRemove(req.params.id)
    .then(result => {
      if (!result) return res.status(404).json({ message: 'Serie not found' });
      return res.sendStatus(204);
    })
    .catch(err => res.status(500).send(err));
});

module.exports = router;
