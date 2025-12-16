import React, { useEffect, useRef, useState } from 'react';
import { getAllMovies } from '../../utils/apicall.js';

const FIXED_SRC = 'https://m.media-amazon.com/images/I/713VJ-dHN9L._AC_UF350,350_QL80_.jpg';

export default function MovieCarouselCustom({ maxItems = 5 }) {
  const [slides, setSlides] = useState([]);
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    getAllMovies()
      .then((movies) => {
        if (!mounted) return;
        const valid = (movies || []).slice();
        // shuffle
        for (let i = valid.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [valid[i], valid[j]] = [valid[j], valid[i]];
        }
        const selected = valid.slice(0, maxItems);
        let s = selected.map((m, idx) => ({
          title: m.title || `Movie ${idx + 1}`,
          src: FIXED_SRC,
          key: m._id || m.id || idx,
        }));
        // if API returned no movies, create placeholder slides so carousel is visible
        if (!s.length) {
          s = Array.from({ length: maxItems }).map((_, idx) => ({
            title: `Movie ${idx + 1}`,
            src: FIXED_SRC,
            key: `placeholder-${idx}`,
          }));
        }
        console.debug('MovieCarouselCustom slides generated', s);
        setSlides(s);
        setActive(0);
      })
      .catch((err) => {
        console.error('MovieCarouselCustom getAllMovies error', err);
        // fallback to placeholders on error
        if (mounted) {
          const s = Array.from({ length: maxItems }).map((_, idx) => ({
            title: `Movie ${idx + 1}`,
            src: FIXED_SRC,
            key: `placeholder-${idx}`,
          }));
          setSlides(s);
          setActive(0);
        }
      });
    return () => { mounted = false; };
  }, [maxItems]);

  if (!slides.length) return null;

  const prev = () => setActive((a) => (a === 0 ? slides.length - 1 : a - 1));
  const next = () => setActive((a) => (a === slides.length - 1 ? 0 : a + 1));

  return (
    <div className="movie-carousel-custom" style={{ width: '100%' }}>
      <div className="carousel-viewport" style={{ overflow: 'hidden' }}>
        <div
          className="carousel-track"
          ref={trackRef}
          style={{
            display: 'flex',
            transition: 'transform 300ms ease',
            transform: `translateX(-${active * 100}%)`,
            width: `${slides.length * 100}%`,
          }}
        >
          {slides.map((s, idx) => (
            <div
              key={s.key}
              className="carousel-item"
              style={{
                flex: '0 0 100%',
                position: 'relative',
                minHeight: 350,
                backgroundImage: `url(${s.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div
                className="carousel-caption"
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  bottom: '0.5rem',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 4,
                }}
              >
                {s.title}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <button onClick={prev} aria-label="Previous" style={{ padding: '6px 10px' }}>Prev</button>
        <div style={{ alignSelf: 'center' }}>{active + 1} / {slides.length}</div>
        <button onClick={next} aria-label="Next" style={{ padding: '6px 10px' }}>Next</button>
      </div>
    </div>
  );
}
