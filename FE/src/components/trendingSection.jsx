import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import { AiFillFire } from 'react-icons/ai';
import Header from './Header.jsx';
import { getTopRanking } from '../utils/apicall.js';

export default function TrendingSection() {
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
  getTopRanking(10)
    .then(setRanking)
    .catch(err => console.error('Error loading ranking:', err));
}, []);

  if (error) return <div style={{ color: '#fff' }}>{error}</div>;
  if (ranking.length === 0) return null;

  return (
    <>
      <Header />
      <div style={styles.section}>
        <Container>
          <div style={styles.header}>
            <h2 style={styles.title}>
              <AiFillFire style={styles.fireIcon} />
              Top 10 por Favoritos
            </h2>

            <div style={styles.rankList}>
              {ranking.map((m, idx) => {
                const isMovie = m.type === 'movie';
                const linkPath = isMovie ? `/movies/details/${m._id}` : `/series/details/${m._id}`;

                const img = m.backdrop_url || m.portada_url;
                const dateRaw = m.createdAt || m.release_date || m.released;
                const dateTxt = dateRaw ? new Date(dateRaw).toLocaleDateString('es-ES') : '—';

                return (
                  <Link key={`${m.type}-${m._id}`} to={linkPath} style={styles.rankRowLink}>
                    <div style={styles.rankRow}>
                      <div style={styles.rankLeft}>
                        <div style={styles.rankNumber}>{idx + 1}</div>
                        <span style={{ ...styles.typeChip, ...(isMovie ? styles.chipMovie : styles.chipSeries) }}>
                          {isMovie ? 'PELÍCULA' : 'SERIE'}
                        </span>
                      </div>

                      <div style={styles.rankBanner}>
                        {img ? <img src={img} alt={m.title} style={styles.rankImg} /> : <div style={styles.noImg} />}
                        <div style={styles.rankOverlay} />
                        <div style={styles.rankName}>
                          {m.title}
                          <div style={styles.rankMeta}>📅 {dateTxt}</div>
                        </div>
                      </div>

                      <div style={styles.rankRight}>
                        <span style={styles.badge}>❤️ {m.favoritesCount ?? 0}</span>
                        <span style={styles.badge}>⭐ {m.imdb_rating ?? 'N/A'}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        </Container>
      </div>
    </>
  );
}
const styles = {
  section: { 
    background: '#0b0b0b', 
    minHeight: '100vh', 
    paddingTop: '20px',
    padding: '60px 0',
    marginBottom: '40px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },

  title: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 10px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
  },

 fireIcon: {
    fontSize: '3rem',
    color: '#ff576c',
    animation: 'flame 2s ease-in-out infinite',
  },

  rankList: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '18px' },
  rankRowLink: { textDecoration: 'none' },

  rankRow: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr 220px',
    alignItems: 'center',
    gap: '14px',
    borderRadius: '28px',
    background: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    height: '78px',
    position: 'relative',
  },

  rankLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingLeft: '14px',
    position: 'relative',
    zIndex: 2,
   },
    rankNumber: {
    width: '46px',
    height: '46px',
    borderRadius: '999px',
    background: '#fff',
    color: '#111',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 900,
    fontSize: '18px',
    zIndex: 3,
  },

  typeChip: {
    padding: '8px 12px', borderRadius: '999px', fontWeight: 800, fontSize: '12px',
    letterSpacing: '0.6px', color: '#fff',
  },
  chipMovie: { background: 'rgba(0,160,255,0.35)' },
  chipSeries:{ background: 'rgba(170,80,255,0.35)' },

  rankBanner: { position: 'relative', height: '100%', overflow: 'hidden', zIndex: 1 },
  rankImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  rankOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.0) 60%)',
  },
  rankName: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#fff',
    fontWeight: 800,
    fontSize: '20px',
    textShadow: '0 2px 12px rgba(0,0,0,0.8)',
  },
  rankMeta: { fontSize: '12px', fontWeight: 700, opacity: 0.9, marginTop: '4px' },

  rankRight: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', paddingRight: '14px' },
  badge: {
    background: 'rgba(0,0,0,0.45)', color: '#fff',
    padding: '10px 14px', borderRadius: '999px', fontWeight: 800, whiteSpace: 'nowrap',
  },
};
