var express = require('express');
var router = express.Router();
const { tokenVerify } = require('../auth');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
var User = require('../models/User.js');
const debug = console.log;

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
      
      console.log("Password enviada:", req.body.password);
      console.log("Password en DB (hash):", user.password);

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
        //jwt.sign({ username: req.body.username }, process.env.TOKEN_SECRET, { expiresIn: 3600 * 4 }, function(err, token) {
        jwt.sign( { id: user._id, username: user.username, email: user.email },process.env.TOKEN_SECRET,{ expiresIn: 3600 * 4 }, function(err, token) {
        if (err) return reject(err);
          resolve(token);
        });
      });
    })
    .then(function(token) {
      return res.status(200).json({ 
        message: 'Autenticación exitosa.',
        token: token,
        user: { id: user._id, username: user.username, email: user.email, name: user.name }
      });
    })
    .catch(function(err) {
      if (err && err.code === 404) return res.status(404).send(err.message);
      if (err && err.code === 401) return res.status(401).send(err.message);
      return res.status(500).send(err && err.message ? err.message : err);
    });
}, function(req, res, next) {});

//Google Sign-In
router.post('/google-signin', async function(req, res, next) {
  debug("Google Sign-In");
  try {
    const { email, name } = req.body;
    
    // Buscar usuario existente
    let user = await User.findOne({ email: email });
    
    // Si no existe, crear uno nuevo
    if (!user) {
      user = await User.create({
        username: email,
        email: email,
        name: name,
        lastname: name, // En Google no siempre tenemos lastname
        password: 'google_signin' // Placeholder, no se usa
      });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.TOKEN_SECRET,
      { expiresIn: 3600 * 24 * 7 } // 7 días
    );
    
    return res.status(200).json({ 
      message: 'Google Sign-In exitoso',
      token: token,
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

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
