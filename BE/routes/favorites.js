var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

// Token generation imports
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

//models
var Favorite = require('../models/Favorite.js');

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

//Agregar nuevo favorito
router.post('/', tokenVerify, async function(req, res) {
  try {
    const { email, movieId, seriesId } = req.body;

    const newFav = await Favorite.create({
      email,
      movie: movieId || null,
      series: seriesId || null
    });

    res.status(201).json(newFav);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



//Ver favoritos de un usuario por email
router.get('/:email', tokenVerify, async function(req, res) {
  try {
    const favorites = await Favorite.find({ email: req.params.email })
      .populate('movie')   // ← carga la película completa
      .populate('series'); // ← carga la serie completa
    return res.status(200).json(favorites);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});



//Delete favorito por ID
router.delete('/:id', tokenVerify, async function(req, res) {
  try {
    debug("Delete favorite by ID");
    const deleted = await Favorite.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
