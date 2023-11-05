import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { doingRequest, perPage } from './js/api';

const el = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  // loadMoreButton: document.querySelector('.load-more'),
  guard: document.querySelector('.js-guard'),
  toTopBtn: document.querySelector('.to-top-btn'),
};

el.form.addEventListener('submit', handlerRequest);
// el.loadMoreButton.addEventListener('click', handlerLoadMore);

let searchQuery = '';
let page;
let instanceSimpleLightbox;
// el.loadMoreButton.classList.add('js-hidden');

const options = {
  root: null,
  rootMargin: '300px',
};

const observer = new IntersectionObserver(handlerLoadMore, options);

function handlerRequest(event) {
  event.preventDefault();

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });

  page = 1;

  // el.loadMoreButton.classList.add('js-hidden');

  const searchQuery = event.currentTarget.elements['searchQuery'].value.trim();
  if (!searchQuery) {
    Notify.info('Enter your request, please');
    return;
  }

  doingRequest(searchQuery)
    .then(({ data }) => {
      if (data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      Notify.info(`Hooray! We found ${data.totalHits} images.`);

      el.gallery.innerHTML = createMarkup(data.hits);

      instanceSimpleLightbox = new SimpleLightbox('.link', {});

      if (data.totalHits > perPage) {
        // el.loadMoreButton.classList.remove('js-hidden');
        observer.observe(el.guard);
      }
    })
    .catch(error => {
      Notify.failure(`Sorry, you have a request error ${error}`);
    });
}

function handlerLoadMore(enteries, observer) {
  enteries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      doingRequest(searchQuery, page)
        .then(({ data }) => {
          el.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
          instanceSimpleLightbox.refresh();

          if (data.totalHits <= page * perPage) {
            // el.loadMoreButton.classList.add('js-hidden');
            observer.unobserve(el.guard);
            Notify.warning(
              "We're sorry, but you've reached the end of search results."
            );
          }
        })
        .catch(error => {
          Notify.failure(`Sorry, you have a request error ${error}`);
        });
    }
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
        <div class="img-cont">
         <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </div>
      </a>
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
      
    </div>`;
      }
    )
    .join(' ');
}

window.addEventListener('scroll', () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    el.toTopBtn.style.display = 'block';
  } else {
    el.toTopBtn.style.display = 'none';
  }
});

el.toTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});
