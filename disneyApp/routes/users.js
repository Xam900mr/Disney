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
    User.findById(req.params.id, function(err, user) {
      if (err) res.status(500).send(err);
      else if (!user) res.status(404).send({ message: 'User not found.' });
      else res.status(200).json(user);
    });
});

//Post new user
router.post('/', function(req, res, next) {
  User.create(req.body, function(err, userinfo) {
    if (err) return res.status(500).send(err);
    else return res.status(201).json(userinfo);
  });
});

//Delete user by ID
router.delete('/:id', tokenVerify,
  function(req, res, next) {
    debug("Delete user by ID");
    User.findByIdAndRemove(req.params.id, function(err, user) {
      if (err) res.status(500).send(err);
      else res.sendStatus(204);
    });
});

//Inicio de sesión
router.post('/login', function(req, res, next) {
  debug("User login");
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) {
      res.status(500).send("Error al buscar el usuario.");
    }
    if (user) {
      debug("User found, checking password");
      user.comparePassword(req.body.password, 
        function(err, isMatch) {
          if (err) {
            res.status(500).send("Error al comprobar la contraseña.");
          }
          if (isMatch) {
            return next();
          } else {
            res.status(401).send("Contraseña incorrecta.");
          }
        });
    } else {
      res.status(404).send("Usuario no encontrado.");
    }
  });
},
function(req, res, next) {
  debug("Generating token ... ");
  jwt.sign({username: req.body.username}, process.env.TOKEN_SECRET, { expiresIn: 3600 * 4 },
    function(err, token) {
      if (err) {
        return res.status(500).send("Error al generar el token.");
      } else {
        return res.status(200).send({
          message: "Autenticación exitosa.",
          token: token
        });
      }
    }
  );
});

//Actualizar usuario por ID
router.put("/:id", tokenVerify, 
  function (req, res, next) {
    debug("Modificación segura de un usuario con token");
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, userinfo) {
        if (err) return res.status(500).send(err);
        else return res.status(200).json(userinfo);
    });
});


module.exports = router;
