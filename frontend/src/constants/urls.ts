const baseURL = `/aps`;

const api = '/api/v1';

const urls = {
    token: `${api}/token`,
    register: `${api}/users`,
    userById: `${api}/users`,
    positions: `${api}/positions`,
    page: '&page=',
    offset:'&offset=',
    count: '&count=',

};

export {
    baseURL,
    urls
}
