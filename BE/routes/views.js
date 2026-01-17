var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const { tokenVerify } = require('../auth');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
var Movie = require('../models/Movie');
var Serie = require('../models/Serie');
var ViewEvent = require('../models/ViewEvent');
const debug = console.log;

router.post('/track', tokenVerify, async (req, res) => {
  try {
    const { contentType, contentId, secondsWatched } = req.body;
    const email = req.userEmail;

    if (!['movie', 'series'].includes(contentType)) {
      return res.status(400).json({ message: 'contentType inválido' });
    }
    if (!contentId) return res.status(400).json({ message: 'contentId requerido' });

    const Model = contentType === 'movie' ? Movie : Serie;
    const doc = await Model.findById(contentId).select('genre').lean();

    const genres = doc?.genre || [];

    await ViewEvent.create({
      email,
      contentType,
      contentId,
      genres,
      secondsWatched: Number(secondsWatched) || 0,
    });

    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/me/stats', tokenVerify, async (req, res) => {
  try {
    const email = req.userEmail;

    // Películas/series “vistas”: únicas por contenido
    const seen = await ViewEvent.aggregate([
      { $match: { email } },
      { $group: { _id: { type: '$contentType', id: '$contentId' } } },
      { $group: { _id: '$_id.type', count: { $sum: 1 } } },
    ]);

    const moviesSeen = seen.find(x => x._id === 'movie')?.count || 0;
    const seriesSeen = seen.find(x => x._id === 'series')?.count || 0;

    // Tiempo total (si algún día lo envías)
    const timeAgg = await ViewEvent.aggregate([
      { $match: { email } },
      { $group: { _id: null, totalSeconds: { $sum: '$secondsWatched' } } },
    ]);
    const totalSecondsWatched = timeAgg[0]?.totalSeconds || 0;

    // Géneros favoritos (para dona)
    const genresAgg = await ViewEvent.aggregate([
      { $match: { email } },
      { $unwind: '$genres' },
      { $group: { _id: '$genres', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);
    const favoriteGenres = genresAgg.map(g => ({ genre: g._id, count: g.count }));

    // Racha: días con al menos 1 evento
    const days = await ViewEvent.aggregate([
      { $match: { email } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$viewedAt' } }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 60 }
    ]);

    const dayList = days.map(d => d._id); // YYYY-MM-DD
    const streakDays = calcStreak(dayList); // función abajo

    // Badges simples par logros
    const badges = [];
    if (moviesSeen + seriesSeen >= 20) badges.push('Cinéfilo');
    if (streakDays >= 7) badges.push('Constante');
    if (totalSecondsWatched >= 10 * 3600) badges.push('Maratonero');

    return res.json({
      moviesSeen,
      seriesSeen,
      totalSecondsWatched,
      favoriteGenres,
      streakDays,
      badges,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Lista de películas vistas (únicas) del usuario, ordenadas por última visualización
router.get('/me/watched/movies', tokenVerify, async (req, res) => {
  try {
    const email = req.userEmail;

    const agg = await ViewEvent.aggregate([
      { $match: { email, contentType: 'movie' } },
      { $group: { _id: '$contentId', lastViewedAt: { $max: '$viewedAt' } } },
      { $sort: { lastViewedAt: -1 } }
    ]);

    const ids = agg.map(e => e._id);
    const movies = await Movie.find({ _id: { $in: ids } })
      .select('title portada_url year imdb_rating genre');

    const map = new Map(movies.map(m => [String(m._id), m]));
    const result = agg
      .map(e => {
        const m = map.get(String(e._id));
        if (!m) return null;
        return {
          _id: m._id,
          title: m.title,
          portada_url: m.portada_url,
        };
      })
      .filter(Boolean);

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Lista de series vistas (únicas) del usuario, ordenadas por última visualización
router.get('/me/watched/series', tokenVerify, async (req, res) => {
  try {
    const email = req.userEmail;

    const agg = await ViewEvent.aggregate([
      { $match: { email, contentType: 'series' } },
      { $group: { _id: '$contentId', lastViewedAt: { $max: '$viewedAt' } } },
      { $sort: { lastViewedAt: -1 } }
    ]);

    const ids = agg.map(e => e._id);
    const series = await Serie.find({ _id: { $in: ids } })
      .select('title portada_url year imdb_rating genre');

    const map = new Map(series.map(m => [String(m._id), m]));
    const result = agg
      .map(e => {
        const m = map.get(String(e._id));
        if (!m) return null;
        return {
          _id: m._id,
          title: m.title,
          portada_url: m.portada_url,
        };
      })
      .filter(Boolean);

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

function calcStreak(dayList) {
  // Cuenta consecutivos desde hoy o desde ayer si hoy no hay
  const toDate = (s) => new Date(s + 'T00:00:00');
  const set = new Set(dayList);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  let start = todayStr;
  if (!set.has(todayStr)) {
    const y = new Date(today);
    y.setDate(y.getDate() - 1);
    const ys = `${y.getFullYear()}-${String(y.getMonth()+1).padStart(2,'0')}-${String(y.getDate()).padStart(2,'0')}`;
    start = ys;
  }

  let streak = 0;
  let d = toDate(start);
  for (;;) {
    const s = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (!set.has(s)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

module.exports = router;