
// https://github.com/SpEcHiDe/IMDbOT/wiki
const IMDBOT_API_URL = 'https://search.imdbot.workers.dev/';


export const getMoviesBy = (keywords) => {
    return fetch(`${IMDBOT_API_URL}/?q=${keywords}`);
}