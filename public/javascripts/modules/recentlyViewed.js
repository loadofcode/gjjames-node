const viewedProduct = document.querySelector('.store')
let recentlyViewed = []

function recentlyViewedProduct(e, products) {
  e.preventDefault()
  console.log(this)
  console.log(products)
  console.log(this.product)
  recentlyViewed.unshift(this)
  console.log('adding products to array', recentlyViewed);
}

viewedProduct.addEventListener('click', recentlyViewedProduct);