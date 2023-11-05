import axios from 'axios';

const MAIN_URL = 'https://pixabay.com/api/';
const API_KEY = '40463763-cd16d3875a37d36e07b72dd03';
const perPage = 40;

async function doingRequest(searchQuery, page = 1) {
  const params = {
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page,
    per_page: perPage,
  };
  const resp = await axios.get(MAIN_URL, { params });

  return resp;
}

export { doingRequest, perPage };
