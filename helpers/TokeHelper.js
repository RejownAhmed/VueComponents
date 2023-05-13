import {parseJwt} from "./parseJWT";

export const getToken = () => {
    const token = localStorage.getItem("access_token");
    if (token) {
        const jwtPayload = parseJwt(token);
        if (jwtPayload.exp < Date.now() / 1000) {
            // token expired
            localStorage.removeItem('access_token');
            return null;
        }
        return token;
    }
}

export const setToken = (token) => {
    return localStorage.setItem("access_token", token)
}