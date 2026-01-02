import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";

import Home from './Home';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
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
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/movies" element={
            <ProtectedRoute>
              <MovieList/>
            </ProtectedRoute>
          } />
          <Route path="/series" element={
            <ProtectedRoute>
              <SeriesList/>
            </ProtectedRoute>
          } />
          <Route path="/characters_movies" element={
            <ProtectedRoute>
              <CMoviesList/>
            </ProtectedRoute>
          } />
          <Route path="/characters_series" element={
            <ProtectedRoute>
              <CSeriesList/>
            </ProtectedRoute>
          } />
          <Route path="/movies/details/:id" element={
            <ProtectedRoute>
              <ShowMovie/>
            </ProtectedRoute>
          } />
          <Route path="/series/details/:id" element={
            <ProtectedRoute>
              <ShowSerie/>
            </ProtectedRoute>
          } />
          <Route path="/characters_movies/details/:id" element={
            <ProtectedRoute>
              <ShowCMovie/>
            </ProtectedRoute>
          } />
          <Route path="/characters_series/details/:id" element={
            <ProtectedRoute>
              <ShowCSerie/>
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute>
              <MyFavorites/>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;