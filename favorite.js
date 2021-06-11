// 設定變數
const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const dataPannel = document.querySelector('#data-pannel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies'))

console.log(favoriteMovies)

function renderMovieList(data) {
    let rawHTML = ''
    data.forEach(item => {
        rawHTML += `
        <div class="col-3">
          <div class="card">
            <img src="${POSTER_URL + item.image}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">more</button>
              <button class="btn btn-danger btn-add-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
        `

    });
    dataPannel.innerHTML = rawHTML
}


function showMovieModal(id) {
    const modalTitle = document.querySelector('#movie-modal-title')
    const modalImage = document.querySelector('#movie-modal-image')
    const modalDate = document.querySelector('#movie-modal-date')
    const modalDescription = document.querySelector('#movie-modal-description')
    axios
        .get(INDEX_URL + id)
        .then((response) => {
            let data = response.data.results
            modalTitle.innerText = data.title
            modalDescription.innerText = data.description
            modalDate.innerText = 'Release data' + data.release_date
            modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster class="img-fluid" />`
        })
}


function removeFromFavorite(id) {
    if(!favoriteMovies) return
    
    const movieIndex = favoriteMovies.findIndex((movie) => movie.id === id)
    if(movieIndex === -1) return
    favoriteMovies.splice(movieIndex, 1)

    

    localStorage.setItem('favoriteMovies',JSON.stringify(favoriteMovies))
    
    renderMovieList(favoriteMovies)
}

renderMovieList(favoriteMovies)



dataPannel.addEventListener('click', function onPanelClicked(event) {
    let target = event.target
    if (target.classList.contains('btn-show-movie')) {
        showMovieModal(Number(target.dataset.id))
    } else if (target.matches('.btn-add-favorite')) {
        removeFromFavorite(Number(target.dataset.id))
    }
})