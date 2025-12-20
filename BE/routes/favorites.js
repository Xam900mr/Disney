var express = require('express');
var router = express.Router();

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
    const deleted = await Favorite.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
