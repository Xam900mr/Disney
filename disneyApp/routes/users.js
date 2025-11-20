var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

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

/* GET users listing. */
router.get('/', tokenVerify,
  function(req, res, next) {
    debug("Get users listing");
    User.find().sort("-creationdate")
      .then(function(users) {
        return res.status(200).json(users);
      })
      .catch(function(err) {
        return res.status(500).send(err);
      });
 });

//Get user by ID
router.get('/:id', tokenVerify,
  function(req, res, next) {
    debug("Get user by ID");
    User.findById(req.params.id)
      .then(function(user) {
        if (!user) return res.status(404).send({ message: 'User not found.' });
        return res.status(200).json(user);
      })
      .catch(function(err) {
        return res.status(500).send(err);
      });
});

//Post new user
router.post('/', function(req, res, next) {
  User.create(req.body)
    .then(function(userinfo) {
      return res.status(201).json(userinfo);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});

//Delete user by ID
router.delete('/:id', tokenVerify,
  function(req, res, next) {
    debug("Delete user by ID");
    User.findByIdAndRemove(req.params.id)
      .then(function() {
        return res.sendStatus(204);
      })
      .catch(function(err) {
        return res.status(500).send(err);
      });
});

//Inicio de sesión
router.post('/login', function(req, res, next) {
  debug("User login");
  User.findOne({ username: req.body.username })
    .then(function(user) {
      if (!user) return Promise.reject({ code: 404, message: 'Usuario no encontrado.' });
      return new Promise(function(resolve, reject) {
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (err) return reject(err);
          if (!isMatch) return reject({ code: 401, message: 'Contraseña incorrecta.' });
          resolve(user);
        });
      });
    })
    .then(function(user) {
      return new Promise(function(resolve, reject) {
        jwt.sign({ username: req.body.username }, process.env.TOKEN_SECRET, { expiresIn: 3600 * 4 }, function(err, token) {
          if (err) return reject(err);
          resolve(token);
        });
      });
    })
    .then(function(token) {
      return res.status(200).send({ message: 'Autenticación exitosa.', token: token });
    })
    .catch(function(err) {
      if (err && err.code === 404) return res.status(404).send(err.message);
      if (err && err.code === 401) return res.status(401).send(err.message);
      return res.status(500).send(err && err.message ? err.message : err);
    });
}, function(req, res, next) {});

//Actualizar usuario por ID
router.put("/:id", tokenVerify, 
  function (req, res, next) {
    debug("Modificación segura de un usuario con token");
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(function(userinfo) {
        return res.status(200).json(userinfo);
      })
      .catch(function(err) {
        return res.status(500).send(err);
      });
});


module.exports = router;
