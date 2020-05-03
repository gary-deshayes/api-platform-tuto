import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { LOGIN_API } from '../config';

//Requete HTTP d'authentification et stockage du token dans le storage et axios
function authenticate(credentials) {
    return axios
        .post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {

            //On stocke le token dans le navigateur
            window.localStorage.setItem("authToken", token);
            //On prévient axios du bearer token
            setAxiosToken(token);
        });

}

//Déconnexion de l'utilisateur et suppression du token du locale storage et axios
function logout() {
    window.localStorage.removeItem('authToken');
    delete axios.defaults.headers['Authorization'];
}

//Ajoute le token à axios
function setAxiosToken(token) {

    axios.defaults.headers['Authorization'] = "Bearer " + token;
}

//On stocke le token dans axios si on est encore connecté dans le storage
function setup() {
    const token = window.localStorage.getItem('authToken');
    if (token) {
        const { exp: expiration } = jwtDecode(token);
        //On compare le timestamp d'expiration en seconde contre le timestamp actuel en ms
        if ((expiration * 1000) > new Date().getTime()) {
            setAxiosToken(token);
        } else {
            logout();
        }
    } else {
        logout();
    }
}

//Renvoi un booléen pour savoir si on est connecté
function isAuthenticated() {
    const token = window.localStorage.getItem('authToken');
    if (token) {
        const { exp: expiration } = jwtDecode(token);
        //On compare le timestamp d'expiration en seconde contre le timestamp actuel en ms
        if ((expiration * 1000) > new Date().getTime()) {
            return true
        }
        return false;
    }
    return false;

}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};