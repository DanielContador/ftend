import Cookies from 'js-cookie';

export const setCookie = (name, value, days = null) => {
    if (days) {
        Cookies.set(name, value, { expires: days });
    } else {
        Cookies.set(name, value); // Set cookie without expiration
    }
};

export const deleteCookie = (name) => {
    Cookies.remove(name); // Remove the specified cookie
};

export const getCookie = (key, req) => {
    return typeof window !== 'undefined'
        ? getCookieFromBrowser(key)
        : getCookieFromServer(key, req);
};

const getCookieFromBrowser = key => {
    return Cookies.get(key);
};
  
const getCookieFromServer = (key, req) => {
    if (!req.cookies) {
        return undefined;
    }
    const rawCookie = req.cookies.get(key);
    if (!rawCookie) {
        return undefined;
    }
    return rawCookie.value;
};
