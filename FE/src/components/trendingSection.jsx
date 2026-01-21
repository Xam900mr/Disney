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
              <style>{`
                @keyframes twinkle {
                  0% { opacity: 0.6; }
                  50% { opacity: 1; }
                  100% { opacity: 0.6; }
                }
              `}</style>

              {ranking.map((m, idx) => {
                const isMovie = m.type === 'movie';
                const linkPath = isMovie ? `/movies/details/${m._id}` : `/series/details/${m._id}`;

                const img = m.backdrop_url || m.portada_url;

                return (
                  <Link key={`${m.type}-${m._id}`} to={linkPath} style={styles.rankRowLink}>
                    <div style={styles.rankRow}>

                      <div style={styles.rankBanner}>
                        {img ? <img src={img} alt={m.title} style={styles.rankImg} /> : <div style={styles.noImg} />}
                        <div style={styles.rankOverlay} />
                      </div>

                      <div style={styles.rankContent}>
                        <div style={styles.rankLeft}>
                          <div style={styles.rankNumber}>{idx + 1}</div>
                          <span style={{ margin: '0 8px', ...styles.typeChip, ...(isMovie ? styles.chipMovie : styles.chipSeries) }}>
                              {isMovie ? 'P' : 'S'}
                          </span>
                        </div>

                        <div style={styles.rankCenter}>
                          <div style={styles.rankName}>{m.title}</div>
                        </div>

                        <div style={styles.rankRight}>
                          <span style={styles.badge}>❤️ {m.favoritesCount ?? 0}</span>
                          <span style={styles.badge}>⭐ {m.imdb_rating ?? 'N/A'}</span>
                        </div>
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
    minHeight: '100vh',
    padding: '60px 0',
    background:'linear-gradient(180deg, #6EC6FF 0%, #8B7CFF 50%, #FFB7D5 100%)',
  
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
    position: 'relative',
    borderRadius: '28px',
    overflow: 'hidden',
    height: '84px',
    background: 'rgba(255,255,255,0.28)',
    border: '1px solid rgba(255,255,255,0.45)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
    backdropFilter: 'blur(8px)',
    alignItems: 'center',
    
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
  chipMovie: { background: 'rgba(0,160,255,0.5)' },
  chipSeries:{ background: 'rgba(170,80,255,0.5)' },

  rankBanner: { 
    position: 'absolute',
    inset: 0,
    zIndex: 0,
  },
  rankImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
    filter: 'saturate(1.1) contrast(1.08) brightness(1.02)',
    transform: 'scale(1.02)',
    background: 'rgba(255,255,255,0.18)'
  },

  rankOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.80) 100%)',
    backdropFilter: 'blur(2px)'
  },
  rankName: {
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#fff',
    fontWeight: 800,
    fontSize: '20px',
    textShadow: '0 2px 12px rgba(0,0,0,0.8)',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    position: 'center',
  },

  rankRight: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', paddingRight: '14px' },
  badge: {
    background: 'rgba(0,0,0,0.45)', color: '#fff',
    padding: '10px 14px', borderRadius: '999px', fontWeight: 800, whiteSpace: 'nowrap',
  },
  rankContent: {
    position: 'relative',
    zIndex: 1,
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '220px 1fr 220px',
    alignItems: 'center',
    padding: '0 14px',
    minWidth: '0',
  },
  rankCenter: {
    display: 'flex',
    alignItems: 'center',
    minWidth: '0',
  },
};
