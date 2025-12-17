import API from './api';

export {
    getAllMovies,
    addNewFavorites,
    getSingleMovie,
    getMyfavorites,
    deleteFavorites,
    googleSignIn,
    getAuthHeader,
    getAllSeries,
    getSingleSerie
}

function getAllMovies() {
    return API.get('/movies').then(res => res.data);
}

function getAllSeries() {
    return API.get('/series').then(res => res.data);
}

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

function addNewFavorites(email, movieId, seriesId = null){
    return API.post('/favorites', {
        email,
        movieId,
        seriesId
    }, {
        headers: getAuthHeader()
    }).then(result => result.data);
}

function getSingleSerie(idmovie) {
    return API.get('/series/'+idmovie).then(res => res.data);
 }

function getSingleMovie(idmovie) {
    return API.get('/movies/'+idmovie).then(res => res.data);
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