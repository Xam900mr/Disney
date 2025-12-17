import React from 'react';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Login from './Login';
import MovieList from './movies/MovieList';
import ShowMovie from './movies/ShowMovie';
import MyFavorites from './movies/MyFavorites';
import SeriesList from './series/SerieList';
import ShowSerie from './series/ShowSerie';
import CSeriesList from './characters_series/CharacterList';
import ShowCSerie from './characters_series/ShowCharacter';
import CMoviesList from './characters_movies/CharacterList';
import ShowCMovie from './characters_movies/ShowCharacter';

function App() {
  return (
    <Router basename={import.meta.env.VITE_PUBLIC_URL}>
      <div>
        <Routes>
          <Route path="/" exact element={<Login/>} />
          <Route path="/movies" element={<MovieList/>} />
          <Route path="/series" element={<SeriesList/>} />
          <Route path="/characters_movies" element={<CMoviesList/>} />
          <Route path="/characters_series" element={<CSeriesList/>} />
          <Route path="/movies/details/:id" element={<ShowMovie/>} />
          <Route path="/series/details/:id" element={<ShowSerie/>} />
           <Route path="/characters_movies/details/:id" element={<ShowCMovie/>} />
          <Route path="/characters_series/details/:id" element={<ShowCSerie/>} />
          <Route path="/favorites" element={<MyFavorites/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;