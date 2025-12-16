import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from 'reactstrap';
import { getAllMovies } from '../../utils/apicall.js';
function MovieCarouselCustom(args) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllMovies()
      .then((movies) => {
        const withBackdrop = (movies || []).filter(
          (m) => typeof m.backdrop_url === 'string' && m.backdrop_url.trim().length > 0
        );
        // shuffle
        const shuffled = withBackdrop.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 5);
        const mapped = selected.map((m) => ({
          src: m.backdrop_url,
          altText: m.title,
          caption: m.title,
          key: m._id,
          id: m._id,
        }));
        setItems(mapped);
      })
      .catch((err) => {
        console.error('Carousel movies load error:', err);
        setItems([]);
      });
  }, []);

  // Auto-advance every 4s when there are items
  useEffect(() => {
    if (!items || items.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [items]);

  const next = () => {
    if (animating) return;
    if (!items || items.length === 0) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    if (!items || items.length === 0) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    if (!items || items.length === 0) return;
    setActiveIndex(newIndex);
  };

  const slides = useMemo(() => items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <div style={{ width: '100%', height: '420px', overflow: 'hidden', position: 'relative' }}>
          <Link to={`/home/details/${item.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
            <img
              src={item.src}
              alt={item.altText}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </Link>
        </div>
        <CarouselCaption
          captionText={item.caption}
          captionHeader={item.caption}
        />
      </CarouselItem>
    );
  }), [items]);

  return (
    <Carousel
      activeIndex={activeIndex}
      next={next}
      previous={previous}
      {...args}
    >
      <CarouselIndicators
        items={items}
        activeIndex={activeIndex}
        onClickHandler={goToIndex}
      />
      {slides}
      <CarouselControl
        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
      />
      <CarouselControl
        direction="next"
        directionText="Next"
        onClickHandler={next}
      />
    </Carousel>
  );
}

export default MovieCarouselCustom;