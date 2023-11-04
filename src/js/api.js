import axios from 'axios';

function doingRequest(searchQuery, page) {
  const MAIN_URL = 'https://pixabay.com/api/';
  const API_KEY = '40463763-cd16d3875a37d36e07b72dd03';
  const perPage = 40;
  const params = {
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page,
    per_page: perPage,
  };
  return axios.get(MAIN_URL, { params });
}

export { doingRequest };
