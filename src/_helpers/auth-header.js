export function authHeader() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));
    let jwt = localStorage.getItem('jwt');
    if (user && jwt) {
        return { 'jwt': jwt };
    } else {
        return {};
    }
}