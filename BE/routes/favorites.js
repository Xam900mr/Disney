var express = require('express');
var router = express.Router();

const Movie = require('../models/Movie');
const Serie = require('../models/Serie');

const { tokenVerify } = require('../auth');
var Favorite = require('../models/Favorite.js');

//Existencia de favorito
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

    const fav = await Favorite.findOne({
      email,
      ...(movieId && { movie: movieId }),
      ...(seriesId && { series: seriesId })
    });

    res.status(200).json({
      exists: !!fav,
      favoriteId: fav ? fav._id : null
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Agregar favorito
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

      // 1) Evitar duplicado
      const exists = await Favorite.findOne({
        email,
        ...(movieId && { movie: movieId }),
        ...(seriesId && { series: seriesId })
      });

      if (exists) {
        return res.status(200).json({ message: 'Ya está en favoritos', favoriteId: exists._id });
      }

      // 2) Crear favorito
      const newFav = await Favorite.create({
        email,
        movie: movieId || null,
        series: seriesId || null
      });

      // 3) Incrementar contador
      if (movieId) {
        await Movie.updateOne({ _id: movieId }, { $inc: { favoritesCount: 1 } });
      } else {
        await Serie.updateOne({ _id: seriesId }, { $inc: { favoritesCount: 1 } });
      }

      return res.status(201).json(newFav);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
});

//Ver favoritos del usuario
router.get('/', tokenVerify, async (req, res) => {
  try {
    const favorites = await Favorite.find({ email: req.userEmail })
      .populate('movie')
      .populate('series');

    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Eliminar favorito

router.delete('/:id', tokenVerify, async (req, res) => {
  try {
    const fav = await Favorite.findById(req.params.id);
    if (!fav) return res.status(404).json({ message: 'Favorite not found' });

    // Seguridad: que solo borre sus favoritos
    if (fav.email !== req.userEmail) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Favorite.deleteOne({ _id: fav._id });

    if (fav.movie) {
      await Movie.updateOne(
        { _id: fav.movie, favoritesCount: { $gt: 0 } },
        { $inc: { favoritesCount: -1 } }
      );
    } else if (fav.series) {
      await Serie.updateOne(
        { _id: fav.series, favoritesCount: { $gt: 0 } },
        { $inc: { favoritesCount: -1 } }
      );
    }

    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


module.exports = router;
