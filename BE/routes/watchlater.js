var express = require('express');
var router = express.Router();

const Movie = require('../models/Movie');
const Serie = require('../models/Serie');

const { tokenVerify } = require('../auth');
var WatchLater = require('../models/WatchLater.js');

//Existencia de watch later
router.post('/check', tokenVerify, async (req, res) => {
  try {
    const { movieId, seriesId } = req.body;
    const email = req.userEmail;

    if (!movieId && !seriesId) {
      return res.status(400).json({
        exists: false,
        message: 'movieId o seriesId es requerido'
      });
    }

    const wl = await WatchLater.findOne({
      email,
      ...(movieId && { movie: movieId }),
      ...(seriesId && { series: seriesId })
    });

    res.status(200).json({
      exists: !!wl,
      watchLaterId: wl ? wl._id : null
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Agregar a watch later
router.post('/', tokenVerify, async (req, res) => {
    try {
      const { movieId, seriesId } = req.body;
      const email = req.userEmail;

      if (!movieId && !seriesId) {
        return res.status(400).json({ error: 'Debes proporcionar una película o serie' });
      }
      if (movieId && seriesId) {
        return res.status(400).json({ error: 'Proporciona solo movieId o solo seriesId' });
      }

      // Evitar duplicado
      const exists = await WatchLater.findOne({
        email,
        ...(movieId && { movie: movieId }),
        ...(seriesId && { series: seriesId })
      });

      if (exists) {
        return res.status(200).json({ message: 'Ya está en ver más tarde', watchLaterId: exists._id });
      }

      // Crear registro
      const newWL = await WatchLater.create({
        email,
        movie: movieId || undefined,
        series: seriesId || undefined
      });

      return res.status(201).json(newWL);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
});

//Ver watch later del usuario
router.get('/', tokenVerify, async (req, res) => {
  try {
    const watchLater = await WatchLater.find({ email: req.userEmail })
      .populate('movie')
      .populate('series');

    res.status(200).json(watchLater);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Eliminar de watch later
router.delete('/:id', tokenVerify, async (req, res) => {
  try {
    const wl = await WatchLater.findById(req.params.id);
    if (!wl) return res.status(404).json({ message: 'Watch later not found' });

    // Seguridad: que solo borre sus propios registros
    if (wl.email !== req.userEmail) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await WatchLater.deleteOne({ _id: wl._id });

    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
