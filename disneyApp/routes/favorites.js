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
router.post('/', tokenVerify,
  function(req, res, next) {
  Favorite.create(req.body, function(err, favoriteinfo) {
    if (err) return res.status(500).send(err);
    else return res.status(201).json(favoriteinfo);
  });
});


//Ver favoritos de un usuario por email
router.get('/:email', tokenVerify,
  function(req, res, next) {
    debug("Get favorites by email");
    Favorite.find({ email: req.params.email }, function(err, favorites) {
      if (err) return res.status(500).send(err);
      else return res.status(200).json(favorites);
    });
});


//Delete favorito por ID
router.delete('/:id', tokenVerify,
  function(req, res, next) {
    debug("Delete favorite by ID");
    Favorite.findByIdAndRemove(req.params.id, function(err, favorite) {
      if (err) return res.status(500).send(err);
      else return res.sendStatus(204);
    });
});

module.exports = router;
