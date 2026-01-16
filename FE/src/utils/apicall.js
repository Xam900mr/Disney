import API from './api';

export {
    getAllMovies,
    getMovieName,
    addNewFavorites,
    getSingleMovie,
    getMyfavorites,
    deleteFavorites,
    googleSignIn,
    loginUser,
    registerUser,
    getAuthHeader,
    getAllSeries,
    getSingleSerie,
    getSerieName,
    getSingleCharacter_Serie,
    getAllCharacters_Series,
    getAllCharacters_Movies,
    getSingleCharacter_Movie,
    checkFavorite,
    getTopRanking
}

//Movies
function getAllMovies() {
    return API.get('/movies').then(res => res.data);
}
function getSingleMovie(idmovie) {
    return API.get('/movies/'+idmovie).then(res => res.data);
 }
 function getMovieName(titleMovie){
    return API.get('/movies/title/'+encodeURIComponent(titleMovie)).then(res => res.data);
}
export const searchMovies = (query) =>
  API.get(`/movies/search/${query}`).then(res => res.data);


//Series
function getAllSeries() {
    return API.get('/series').then(res => res.data);
}
function getSingleSerie(idserie) {
    return API.get('/series/'+idserie).then(res => res.data);
 }
function getSerieName(titleSerie){
    return API.get('/series/title/'+titleSerie).then(res => res.data);
}
export const searchSeries = (query) =>
  API.get(`/series/search/${query}`).then(res => res.data);

// Busqueda unificada
export const searchAll = async (query) => {
  const [movies, series, charactersMovies, charactersSeries] = await Promise.all([
    API.get(`/movies/search/${query}`).then(r => r.data),
    API.get(`/series/search/${query}`).then(r => r.data),
    API.get(`/characters_movies/search/${query}`).then(r => r.data),
    API.get(`/characters_series/search/${query}`).then(r => r.data)
  ]);

  return [
    ...movies.map(m => ({ ...m, type: 'movie' })),
    ...series.map(s => ({ ...s, type: 'series' })),
    ...charactersMovies.map(c => ({ ...c, type: 'character_movie' })),
    ...charactersSeries.map(c => ({ ...c, type: 'character_series' }))
  ];
};

//Personajes Series
function getAllCharacters_Series() {
    return API.get('/characters_series').then(res => res.data);
}
function getSingleCharacter_Serie(idcharacter) {
    return API.get('/characters_series/'+idcharacter).then(res => res.data);
 }

//Personajes Peliculas
function getAllCharacters_Movies() {
    return API.get('/characters_movies').then(res => res.data);
}
function getSingleCharacter_Movie(idcharacter) {
    return API.get('/characters_movies/'+idcharacter).then(res => res.data);
 }


//Inicio de sesion
function googleSignIn(email, name) {
    return API.post('/users/google-signin', {
        email,
        name
    }).then(result => result.data);
}

function loginUser(username, password) {
    return API.post('/users/login', {
        username,
        password
    }).then(result => result.data);
}

function registerUser(userData) {
    // Mapear firstname a name para coincidir con el modelo backend
    const mappedData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        name: userData.firstname,
        lastname: userData.lastname,
        avatar: userData.avatar
    };
    return API.post('/users', mappedData).then(result => result.data);
}

function getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}


//Favoritos
function addNewFavorites(email, movieId= null, seriesId = null){
    return API.post('/favorites', {
        movieId,
        seriesId
    }, {
        headers: getAuthHeader()
    }).then(result => result.data);
}
function getMyfavorites(email) {
    return API.get('/favorites', {
        headers: getAuthHeader()
    }).then(res => res.data);
}
function deleteFavorites(idfavorites) {
    return API.delete('/favorites/'+idfavorites, {
        headers: getAuthHeader()
    }).then(result => result.data);
}
function checkFavorite(movieId = null, seriesId = null) {
    return API.post('/favorites/check',
        { movieId, seriesId },
        { headers: getAuthHeader() }
    ).then(res => res.data);
}

//ranking
function getTopRanking(limit = 10) {
  return API.get(`/ranking/top?limit=${limit}`).then(res => res.data);
}

