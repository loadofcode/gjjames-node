import axios from 'axios'
import dompurify from 'dompurify' //sanitize inputand html fields

function searchResultsHTML(products) {
  return products.map(product => {
    return `
      <a href="/stock1234/product/${product.slug}" class="search__result search__result--margin">
        <img src="/uploads/${product.photo}"/><strong>${product.SKU} </strong><span>- ${product.productName}</span>
      </a>
    `;
  }).join('');
}

function typeAheadHome(search) {
  if(!search) return;

  const searchInput = search.querySelector('input[name="hero-search"]')
  const searchResults = search.querySelector('.search__hero-results')

  searchInput.on('input', function() {
    // if no value quite
    if(!this.value) {
      searchResults.style.display = 'none';
      return;
    }

    searchResults.style.display = 'block';

    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        if(res.data.length) {
          searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
          return
        }
        // nothign came back
        searchResults.innerHTML = dompurify.sanitize(`<div class="search__result-hero">No results for <strong>${this.value}</strong> found!</div>`);
      })
      .catch(err => {
        console.error(err);
      })
  })

  // handle keyboard inputs
  searchInput.on('keyup', (e) => {
    if(![38,40,13].includes(e.keyCode)) {
      return;
    }
    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result-hero');
    let next;
    if (e.keyCode === 40 && current) {
      next = current.nextElementSibling || items[0]
    } else if (e.keyCode === 40) {
      next = items[0]
    } else if (e.keyCode === 38 && current) {
      next = current.previousElementSibling || items[items.length - 1]
    } else if (e.keyCode ===38) {
      next = items[items.length - 1]
    } else if ( e.keyCode === 13 && current.href) {
      window.location = current.href
      return
    }

    if(current) {
      current.classList.remove(activeClass)
    }
    next.classList.add(activeClass);
  })

}

export default typeAheadHome;