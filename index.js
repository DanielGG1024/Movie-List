
// <--------------變數 常數----------------------------->
const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

// 待放完整的電影
const movies = []
// 待放被收尋的電影
let filteredMovies = []
// 用來轉換list or card 模式
let switchIndex = '1'
let indexPage = 1
const dataPannel = document.querySelector('#data-pannel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const iconWrapper = document.querySelector('.icon-wrapper')
const paginator = document.querySelector('#paginator')
//每一頁的資料筆數
const MOVIE_PER_PAGE = 12

// <--------------函式區----------------------------->
// 渲染主畫面
// renderMovieByCardMode === 1
//預設為卡片模式
function renderMovieByCardMode (data) {
    let rawHTML = ''
    data.forEach((item) => {
        rawHTML += `
        <div class="col-3">
          <div class="card">
            <img src="${POSTER_URL + item.image}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">more</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>`
    });
    dataPannel.innerHTML = rawHTML
}
// 渲染主畫面
// 當renderMovieByListMode === 2
//改成渲染卡片模式
function renderMovieByListMode (data) {
    let rawHTML = ''
    data.forEach(element => {
        rawHTML += `
        <div class="col-12 d-flex justify-content-between p-2 m-3 border-bottom">
           <div class="my-auto">         
             <h5>${element.title}</h5>
           </div>           
           <div class="">
             <button class= "btn btn-primary btn-show-movie m-1" data-toggle="modal" data-target="#movie-modal" data-id="${element.id}">More</bouutn>
             <button class= "btn btn-danger btn-add-favorite m-1" data-id="${element.id}">+</bouutn>
           </div> 
        </div>         
          `
    });
    dataPannel.innerHTML = rawHTML
}

// MODAL
// 點擊MORE時呼叫
function showMovieModal (id) {
    // MODAL區 需要被輸入資料的位置
    const modalTitle = document.querySelector('#movie-modal-title')
    const modalImage = document.querySelector('#movie-modal-image')
    const modalDate = document.querySelector('#movie-modal-date')
    const modalDescription = document.querySelector('#movie-modal-description')
    // 利用AXIOS + ID 找到該電影的詳細資料
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

// favorite
// 點擊btn " + " 時呼叫
function addToFavorite (id) {
    // 從localstorage 中拿取 key:favoriteMovie 並轉成JS原生物件 存入變數LIST
    // 如果 localstorage 中沒有favoriteMovie 賦予 LIST 為 空陣列    
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    // find 將全部的movies 一個一個取出 至 movie處 並將 movie.id 與 參數id做比較
    // 如果相等將存入 變數 movie 
    const movie = movies.find((movie) => movie.id === id)
    // 檢查LIST中是否有相同的ID
    // 有的話就報錯
    // 沒有的話就將MOVIE推入LIST
    if (list.some((movie) => movie.id === id)) {
        return alert('電影已在收藏清單中')
    } else {
        alert('加入成功')
        list.push(movie)
    }
    // 將LIST裡的值轉成字串 存入LOCALSTORAGE
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// 該頁的資料
// 輸入"頁數"會輸出該頁資料
function getMovieByPage (page) {
    // 如果filteredMovies.length為真 data = filteredMovies 
    //    如不為真 data = movies
    const data = filteredMovies.length ? filteredMovies : movies
    const startIndex = (page - 1) * MOVIE_PER_PAGE
    // 回傳該頁資料
    return data.slice(startIndex, startIndex + MOVIE_PER_PAGE)
}
// 噴頁數
// 須入總資料內容
function renderPaginator (amount) {
    const numberOfPages = Math.ceil(amount / MOVIE_PER_PAGE)
    let rawHtml = ''
    for (let page = 1; page <= numberOfPages; page++) {
        
        rawHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
    }
    paginator.innerHTML = rawHtml
}



// <--------------取得資料並選染主畫面----------------------------->

axios
    .get(INDEX_URL)
    .then((reponse) => {
        movies.push(...reponse.data.results)
        renderPaginator(movies.length)
        renderMovieByCardMode(getMovieByPage(indexPage))
    }).catch((err) => console.log(err))

// <--------------監聽區----------------------------->

dataPannel.addEventListener('click', function onPanelClicked(event) {
    let target = event.target
    if (target.classList.contains('btn-show-movie')) {
        showMovieModal(Number(target.dataset.id))
    } else if (target.matches('.btn-add-favorite')) {
        addToFavorite(Number(target.dataset.id))
    }
})


searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
    //取消預設行為
    event.preventDefault()
    const keyword = searchInput.value.trim().toLowerCase()
    if (!keyword.length) {
        return alert('請輸入有效字串！')
    }
    filteredMovies = []
    filteredMovies = movies.filter((movie) =>
        movie.title.trim().toLowerCase().includes(keyword)
    )
    if (filteredMovies.length === 0) {
        return alert(`您輸入的關鍵字${keyword} 沒有符合的電影`)
    }
    renderPaginator(filteredMovies.length)
    if (switchIndex === '1') {
        renderMovieByCardMode(getMovieByPage(indexPage))
    } else if (switchIndex === '2') {
        renderMovieByListMode(getMovieByPage(indexPage))
    }
})

paginator.addEventListener('click', function onPaginatorClick(event) {
    let target = event.target
    if (target.tagName !== 'A') return
    const page = Number(target.dataset.page)
    indexPage = page 
    if (switchIndex === '1') {
        renderMovieByCardMode(getMovieByPage(indexPage))
    } else if (switchIndex === '2') {
        renderMovieByListMode(getMovieByPage(indexPage))
    }
})

iconWrapper.addEventListener('click', function onModeOfListClick(event) {
    let target = event.target
    const data = filteredMovies.length ? filteredMovies : movies
    renderPaginator(data.length)
    if (target.matches('.fa-bars')) {
        renderMovieByListMode(getMovieByPage(indexPage))
        switchIndex = '2'
    } else if (target.matches('.fa-th')) {
        renderMovieByCardMode(getMovieByPage(indexPage))
        switchIndex = '1'
    }
})