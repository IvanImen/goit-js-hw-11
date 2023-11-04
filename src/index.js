import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { doingRequest } from './js/api';

const el = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

el.form.addEventListener('submit', handlerRequest);

let page = 1;
function handlerRequest(event) {
  event.preventDefault();
  const searchQuery = event.currentTarget.elements['searchQuery'].value.trim();
  if (!searchQuery) {
    Notify.info('Enter your request, please');
    return;
  }
  console.log(searchQuery);
  doingRequest(searchQuery, page)
    .then(({ data }) => {
      console.log(data);

      if (data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      el.gallery.innerHTML = createMarkup(data.hits);
    })
    .catch(error => {
      Notify.failure(`Sorry, you have a request error ${error}`);
    });
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
    <div class="photo-card">
      <a href="${largeImageURL}" class="link">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>\n${likes}
          </p>
          <p class="info-item">
            <b>Views</b>\n${views}
          </p>
          <p class="info-item">
            <b>Comments</b>\n${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>\n${downloads}
          </p>
        </div>
      </a>
    </div>`;
      }
    )
    .join(' ');
}
