import API from './api';

export {
    getAllMovies,
    addNewFavorites,
    getSingleMovie,
    getMyfavorites,
    deleteFavorites,
    googleSignIn,
    getAuthHeader
}

function getAllMovies() {
    return API.get('/movies').then(res => res.data);
}

function googleSignIn(email, name) {
    return API.post('/users/google-signin', {
        email,
        name
    }).then(result => result.data);
}

function getAuthHeader() {
    const token = sessionStorage.getItem('token');
    console.log('[apicall] Token obtenido:', token ? 'SÍ' : 'NO');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

function addNewFavorites(email, movieId, seriesId = null){
    const authHeader = getAuthHeader();
    
    console.log('[addNewFavorites] Iniciando...');
    console.log('[addNewFavorites] Email:', email);
    console.log('[addNewFavorites] MovieID:', movieId);
    console.log('[addNewFavorites] Headers:', authHeader);
    
    return API.post('/favorites', {
        email,
        movieId,
        seriesId
    }, {
        headers: authHeader
    }).then(result => {
        console.log('[addNewFavorites] ✓ Éxito:', result.data);
        return result.data;
    }).catch(error => {
        console.error('[addNewFavorites] ✗ Error:', error);
        console.error('[addNewFavorites] Response:', error.response?.data);
        throw error;
    });
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
