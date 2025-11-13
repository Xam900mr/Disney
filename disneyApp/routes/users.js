var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var router = express.Router();

// Token generation imports
const dotenv = require('dotenv');

dotenv.config();

//models
var User = require('../models/User.js');

mongoose.set("strictQuery", false);
var db = mongoose.connection;

function tokenVeryfy(req, res, next) {
  var authHeader = req.headers['authorization'];
  const retrievedToken = authHeader.split(' ')[1];

  if (!retrievedToken) {
    res.status(401).send({
      ok: false,
      message: 'No token provided.'
    });
  } else {
    jwt.verify(retrievedToken, process.env.TOKEN_SECRET, function (err, decoded) {
      if (err) {
        res.status(401).send({
          ok: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
}

/* GET users listing. */
router.get('/', tokenVeryfy,
  function(req, res, next) {
    debug("Get users listing");
    User.find().sort("-creationdate").exec(function(err, users) {
      if (err) res.status(500).send(err); 
      else res.status(200).json(users);
    });
});

//Get user by ID
router.get('/:id', tokenVeryfy,
  function(req, res, next) {
    debug("Get user by ID");
    User.findById(req.params.id, function(err, user) {
      if (err) res.status(500).send(err);
      else res.status(200).json(userinfo);
    });
});

//Post new user
router.post('/', function(req, res, next) {
  User.create(req.body, function(err, userinfo) {
    if (err) res.status(500).send(err);
    else res.status(201);
  });
});

//Delete user by ID
router.delete('/:id', tokenVeryfy,
  function(req, res, next) {
    debug("Delete user by ID");
    User.findByIdAndRemove(req.params.id, function(err, user) {
      if (err) res.status(500).send(err);
      else res.status(204);
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
            next();
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
        res.status(500).send("Error al generar el token.");
      } else {
        res.status(200).send({
          message: "Autenticación exitosa.",
        });
      }
    }
  );
});

//Actualizar usuario por ID
router.put("/:id", tokenVerify, 
  function (req, res, next) {
    debug("Modificación segura de un usuario con token");
    User.findByIdAndUpdate(req.params.id, req.body, function (err, userinfo) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
    });
});


module.exports = router;
