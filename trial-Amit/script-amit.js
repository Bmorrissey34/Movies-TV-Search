// let api_url =
//   'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=97b02d3f0196ff4ae8de221437c48834&page=1';

let base_url = "https://api.themoviedb.org/3"
let api_url =
  'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=97b02d3f0196ff4ae8de221437c48834';

// let page1_url = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=97b02d3f0196ff4ae8de221437c48834"

let img_path = 'https://image.tmdb.org/t/p/w1280';

let search_api = 'https://api.themoviedb.org/3/search/movie?api_key=97b02d3f0196ff4ae8de221437c48834&query="'


let genres = [
  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentary"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 14,
    "name": "Fantasy"
  },
  {
    "id": 36,
    "name": "History"
  },
  {
    "id": 27,
    "name": "Horror"
  },
  {
    "id": 10402,
    "name": "Music"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 878,
    "name": "Science Fiction"
  },
  {
    "id": 10770,
    "name": "TV Movie"
  },
  {
    "id": 53,
    "name": "Thriller"
  },
  {
    "id": 10752,
    "name": "War"
  },
  {
    "id": 37,
    "name": "Western"
  }
]

let form = document.getElementById('form')
let search = document.getElementById('search')
let main = document.getElementById('main')
let tagsEl = document.getElementById("tags")

let prev = document.getElementById("prev")
let next = document.getElementById("next")
let current = document.getElementById("current")

let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = '';
let totalPages = 100;

let selectedGenre = []

setGenre();

function setGenre() {
  tagsEl.innerHTML = ''

  for (let i = 0; i < genres.length; i++) {
    let tagDivEl = document.createElement('div');
    tagDivEl.classList.add('tag');
    tagDivEl.id = genres[i].id;
    tagDivEl.innerText = genres[i].name;

    tagDivEl.addEventListener('click', function () {
      if (selectedGenre.length == 0) {
        selectedGenre.push(genres[i].id)
      } else {
        if (selectedGenre.includes(genres[i].id)) {
          for (let z = 0; z < selectedGenre.length; z++) {
            if (selectedGenre[z] == genres[i].id) {
              let idx = selectedGenre.indexOf(selectedGenre[z])
              selectedGenre.splice(idx, 1);
            }
          }
        } else {
          selectedGenre.push(genres[i].id)
        }
      }
      console.log(selectedGenre)
      getMovies(`${api_url}&with_genres=${selectedGenre.join(',')}`)

      highlightSelectedGenre();
    })
    tagsEl.appendChild(tagDivEl);
  }
}

function clearButton() {
  let clearbutton = document.getElementById('clear')
  if (clearbutton) {
    clearbutton.classList.add('highlight');
  } else {
    let clrBtn = document.createElement('div')
    clrBtn.classList.add('tag', 'highlight')
    clrBtn.id = 'clear';
    clrBtn.innerText = 'Clear-Genre'
    clrBtn.addEventListener('click', function () {
      selectedGenre = [];
      setGenre();
      getMovies(api_url);
    })
    tagsEl.appendChild(clrBtn);
  }
}

getMovies(api_url)

function highlightSelectedGenre() {
  let tags = document.querySelectorAll(".tag")

  for (let z = 0; z < tags.length; z++) {
    tags[z].classList.remove("highlight")
  }
  clearButton()
  if (selectedGenre.length !== 0) {
    for (let i = 0; i < selectedGenre.length; i++) {
      let highlightedTag = document.getElementById(selectedGenre[i])
      highlightedTag.classList.add('highlight')
    }
  }
}

function getMovies(url) {
  lastUrl = url;

  // lastUrl = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=97b02d3f0196ff4ae8de221437c48834&page=1"
  fetch(url)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      console.log(data.results)

      if (data.results.length !== 0) {
        showMovies(data.results)
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        current.innerText = currentPage
        if (currentPage <= 1) {
          prev.classList.add("disabled")
          next.classList.remove("disabled")
        } else if (currentPage >= totalPages) {
          prev.classList.remove("disabled")
          next.classList.add("disabled")
        } else {
          prev.classList.remove("disabled")
          next.classList.remove("disabled")
        }



      } else {
        main.innerHTML = `<h1 class='noResults'>No Results Found</h1>`
      }

    })
}

function showMovies(results) {
  // console.log(results)
  main.innerHTML = ''
  for (let i = 0; i < results.length; i++) {
    let movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.innerHTML = `<img src="${img_path}${results[i].poster_path}" alt="${results[i].title}" <div class="movie-info"><h3>${results[i].title}</h3><span class="${getColor(results[i].vote_average)}">${results[i].vote_average}</span></div><div class="overview"><h3>Overview</h3>${results[i].overview}<br/><button class="know-more" id="${results[i].id}">Know More</button></div>`;
    
    main.appendChild(movieEl)

    document.getElementById(results[i].id).addEventListener("click", function () {
      console.log(results[i].id)
      openNav(results[i])
    })
  }
}


// Full screen Overlay Navigation from https://www.w3schools.com/howto/howto_js_fullscreen_overlay.asp

let overlayContent = document.getElementById("overlay-content")

/* Open when someone clicks on the span element */
function openNav(movie) {
  // https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key=<<api_key>>&language=en-US
  fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=97b02d3f0196ff4ae8de221437c48834`)
    .then(function (response) {
      return response.json()
    })
    .then(function (videoData) {
      console.log(videoData)
      if (videoData){
        document.getElementById("myNav").style.width = "100%";
        if(videoData.results.length > 0){
          
          let embed = [];

          for(let i = 0; i < videoData.results.length; i++){
            if(videoData.results[i].site == "YouTube"){
              embed.push(`<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoData.results[i].key}"${videoData.results[i].name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
            }
          }

          
          overlayContent.innerHTML = embed.join("");
          
        }else {
          overlayContent.innerHTML = `<h1 class='noResults'>No Results Found</h1>`
        }
      }
    })

  
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}


function getColor(vote) {
  if (vote >= 8) {
    return "green"
  } else if (vote >= 5) {
    return "orange"
  } else {
    return "red"
  }
}

form.addEventListener('submit', function (event) {
  event.preventDefault();
  let searchTerm = search.value

  selectedGenre = [];
  setGenre();

  if (searchTerm && searchTerm !== '') {
    getMovies(search_api + searchTerm)
    search.value = ''
  } else {
    window.location.reload()
  }
})

next.addEventListener('click', function () {
  if (nextPage <= totalPages) {
    nextPageCall(nextPage);
  }
})

prev.addEventListener('click', function () {
  if (prevPage > 0) {
    nextPageCall(prevPage);
  }
})

function nextPageCall(page) {
  // lastUrl = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=97b02d3f0196ff4ae8de221437c48834&page=1"


  let urlSplit = lastUrl.split('?')
  // split by ?--- "https://api.themoviedb.org/3/discover/movie"  + "sort_by=popularity.desc&api_key=97b02d3f0196ff4ae8de221437c48834&page=1"

  let queryParameter = urlSplit[1].split('&')
  // "sort_by=popularity.desc" + "api_key=97b02d3f0196ff4ae8de221437c48834" + "page=1"

  let key = queryParameter[queryParameter.length - 1].split('=')
  // "page" + "1"

  if (key[0] != 'page') {
    let url = `${lastUrl}&page=${page}`;
    getMovies(url)
  } else {
    key[1] = page.toString();
    let x = key.join('=')
    queryParameter[queryParameter.length - 1] = x;
    let y = queryParameter.join("&")
    let z = urlSplit.join("?")
    let url = z + y
    getMovies(url)

  }
}