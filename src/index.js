import Notiflix from 'notiflix';
import { fetchImages } from './apiService';
import { renderGallery } from './gallery';

let query = '';
let page = 1;

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  query = e.currentTarget.elements.searchQuery.value.trim();
  if (!query) {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }

  page = 1;
  clearGallery();
  loadMoreBtn.style.display = 'none';

  try {
    const data = await fetchImages(query, page);
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    renderGallery(data.hits);
    if (data.hits.length < data.totalHits) {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
}

async function onLoadMore() {
  page += 1;
  try {
    const data = await fetchImages(query, page);
    renderGallery(data.hits);
    if (data.hits.length < 40) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
}

function clearGallery() {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
}
