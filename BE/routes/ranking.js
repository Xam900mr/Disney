var express = require('express');
var router = express.Router();
const Movie = require('../models/Movie');
const Serie = require('../models/Serie');

router.get("/top", async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 10, 50));
    const projection = "title backdrop_url portada_url favoritesCount imdb_rating createdAt release_date";
    const perCollection = Math.max(limit * 3, 30);

    const [movies, series] = await Promise.all([
      Movie.find({ favoritesCount: { $gt: 0 } })
        .select(projection)
        .sort({ favoritesCount: -1, imdb_rating: -1 })
        .limit(perCollection)
        .lean(),
      Serie.find({ favoritesCount: { $gt: 0 } })
        .select(projection)
        .sort({ favoritesCount: -1, imdb_rating: -1 })
        .limit(perCollection)
        .lean(),
    ]);

    const combined = [
      ...movies.map((m) => ({ ...m, type: "movie" })),
      ...series.map((s) => ({ ...s, type: "series" })),
    ]
      .sort((a, b) => {
        const fav = (b.favoritesCount || 0) - (a.favoritesCount || 0);
        if (fav !== 0) return fav;
        return (parseFloat(b.imdb_rating) || 0) - (parseFloat(a.imdb_rating) || 0);
      })
      .slice(0, limit);

    return res.json(combined);
    } catch (err) {
    console.error("GET /ranking/top error:", err);
    return res.status(500).json({ message: "Error loading ranking" });
  }
});

module.exports = router;