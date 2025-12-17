import API from './api';

export {
    getAllMovies,
    getMovieName,
    addNewFavorites,
    getSingleMovie,
    getMyfavorites,
    deleteFavorites,
    googleSignIn,
    getAuthHeader,
    getAllSeries,
    getSingleSerie,
    getSerieName,
    getSingleCharacter_Serie,
    getAllCharacters_Series,
    getAllCharacters_Movies,
    getSingleCharacter_Movie,
    checkFavorite
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

function getAuthHeader() {
    const token = sessionStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}


//Favoritos
function addNewFavorites(email, movieId= null, seriesId = null){
    return API.post('/favorites', {
        email,
        movieId,
        seriesId
    }, {
        headers: getAuthHeader()
    }).then(result => result.data);
}
function getMyfavorites(email) {
    return API.get('/favorites/'+email, {
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
