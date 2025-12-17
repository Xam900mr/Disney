import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import { getAllSeries } from '../../utils/apicall.js';

function SeriesCarousel(args) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getAllSeries()
      .then((series) => {
        const withBackdrop = (series || []).filter(
          (s) => typeof s.backdrop_url === 'string' && s.backdrop_url.trim().length > 0
        );
        // shuffle
        const shuffled = withBackdrop.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 5);
        const mapped = selected.map((s) => ({
          src: s.backdrop_url,
          altText: s.title,
          caption: s.title,
          id: s._id,
        }));
        setItems(mapped);
      })
      .catch((err) => {
        console.error('Carousel series load error:', err);
        setItems([]);
      });
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <Carousel fade interval={4000} pause="hover" {...args}>
      {items.map((item) => (
        <Carousel.Item key={item.id}>
          <Link to={`/series/details/${item.id}`} style={{ display: 'block', width: '100%', height: 'auto', overflow: 'hidden', margin: '0 auto' }}>
            <img
              src={item.src}
              alt={item.altText}
              style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </Link>
          <Carousel.Caption>
            <h3>{item.caption}</h3>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default SeriesCarousel;