import axios from 'axios'
import jwt_decode from "jwt-decode";
const api_endpoint = "https://awd-backend.herokuapp.com/";
// const api_endpoint = "http://localhost:5000/";

export const register = newUser => {
    return axios
        .post(api_endpoint + "users/register", {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            password: newUser.password
        })
}

export const updateUser = userData => {
    return axios
        .post(api_endpoint + "users/update", {
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            address: userData.address,
            city: userData.city,
            country: userData.country,
            postal_code: userData.postal_code,
            about_me: userData.about_me
        })
}

export const forgotPassword = userData => {
    return axios
        .post(api_endpoint + "users/forgot", {
            email: userData.email
        })
}

export const resetPassword = userData => {
    return axios
        .post(api_endpoint + "users/reset", {
            reset_token: userData.reset_token,
            password: userData.password
        })
}

export const login = user => {
    return axios
        .post(api_endpoint + "users/login", {
            email: user.email,
            password: user.password
        })
}


export const setUserToken = (key, token) => {
    localStorage.setItem(key, token);
}

export const getUserToken = (key) => {
    let decoded = null;
    try {
        const token = localStorage.getItem(key);
        if (token) {
            decoded = jwt_decode(token);
        }
        else {
            decoded = "";
        }
    } catch (error) {
        console.log(error);
    }
    return decoded;
}

export const deleteUserToken = (key) => {
    return localStorage.removeItem(key);
}

export const isAuthenticated = () => {
    let authenticated = false;
    let token = getUserToken('usertoken');
    if (token) {
        authenticated = true;
    }
    return authenticated;
}
