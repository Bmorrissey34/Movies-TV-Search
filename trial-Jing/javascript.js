let api_url =
"https://unogsng.p.rapidapi.com/search?type=series&start_year=2020&orderby=rating&limit=100&subtitle=english&offset=0&end_year=2021";

  let search_api = 'https://unogsng.p.rapidapi.com/search?type=series&query=';

let form = document.getElementById('form')
let search = document.getElementById('search')
let main = document.getElementById('main')
let tagsEl = document.getElementById("tags")

let years = [
    {
      "id": 2008,
      "name": "Year 2008"
    },
    {
      "id": 2009,
      "name": "Year 2009"
    },
    {
      "id": 2010,
      "name": "Year 2010"
    },
    {
      "id": 2011,
      "name": "Year 2011"
    },
    {
      "id": 2012,
      "name": "Year 2012"
    },
    {
      "id": 2013,
      "name": "Year 2013"
    },
    {
      "id": 2014,
      "name": "Year 2014"
    },
    {
      "id": 2015,
      "name": "Year 2015"
    },
    {
      "id": 2016,
      "name": "Year 2016"
    },
    {
      "id": 2017,
      "name": "Year 2017"
    },
    {
      "id": 2018,
      "name": "Year 2018"
    },
    {
      "id": 2019,
      "name": "Year 2019"
    },
    {
      "id": 2020,
      "name": "Year 2020"
    },
    {
      "id": 2021,
      "name": "Year 2021"
    }
  ]

let selectedGenre = []

setYear()

function setYear(){
    tagsEl.innerHTML = ''

    for(let i = 0; i < years.length; i++){
        let tagDivEl = document.createElement('div');
        tagDivEl.classList.add('tag');
        tagDivEl.id = years[i].id;
        tagDivEl.innerText = years[i].name;
        
        tagDivEl.addEventListener('click', function(){
            if(selectedGenre.length == 0){
                selectedGenre.push(years[i].id)
            }else{
                if(selectedGenre.includes(years[i].id)){
                    for(let z = 0; z < selectedGenre.length; z++){
                        if(selectedGenre[z] == years[i].id){
                            let idx = selectedGenre.indexOf(selectedGenre[z])
                            selectedGenre.splice(idx, 1);
                        }    
                    }
                }else{
                    selectedGenre.push(years[i].id)
                }
            }
            
            getMovies(`https://unogsng.p.rapidapi.com/search?type=series&start_year=${years[i].id}&orderby=rating&limit=100&subtitle=english&offset=0&end_year=${years[i].id}&page_1`)

            highlightSelectedGenre();
        })
        tagsEl.appendChild(tagDivEl);
    }
}

function clearButton(){
    let clearbutton = document.getElementById('clear')
    if(clearbutton){
        clearbutton.classList.add('highlight');
    }else{
        let clrBtn = document.createElement('div')
    clrBtn.classList.add('tag', 'highlight')
    clrBtn.id = 'clear';
    clrBtn.innerText = 'Clear-Genre'
    clrBtn.addEventListener('click', function(){
        selectedGenre = [];
        setYear();
        getMovies(api_url);
    })
    tagsEl.appendChild(clrBtn);
    }  
}

function highlightSelectedGenre(){
    let tags = document.querySelectorAll(".tag")

    for (let z = 0; z < tags.length; z++){
        tags[z].classList.remove("highlight")
    }
    clearButton()
    if(selectedGenre.length !== 0){
        for(let i = 0; i < selectedGenre.length; i++){
            let highlightedTag = document.getElementById(selectedGenre[i])
            highlightedTag.classList.add('highlight')
        }
    }
}

getMovies(api_url)

function getMovies(url){
    fetch(url, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "unogsng.p.rapidapi.com",
        "x-rapidapi-key": "b2b3be113bmshd0fa0a5597cdfeap1cb263jsnd640f9883203"
      }
    })
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        // console.log(data);
        if(data.results.length !== 0){
            showMovies(data.results)
        }else {
            main.innerHTML = `<h1 class='noResults'>No Results Found</h1>`
        }
        
    })
}

function showMovies(results){
    console.log(results)
    main.innerHTML = ''
    for (let i = 0; i < results.length; i++){
        let movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `<img src="${results[i].poster}" alt="${results[i].title}" <div class="movie-info"><h3 style="color:white; margin:10px">${results[i].title}</h3><span class="movie-score" style="color:white; margin:10px">${results[i].imdbrating}</span></div><div class="overview"><h3>Overview</h3>${results[i].synopsis}<br/><button class="know-more" id="${results[i].imdbid}">Know More</button></div>`;
        main.appendChild(movieEl)
        //
        document.getElementById(results[i].imdbid).addEventListener("click", function () {
          fetch(`https://imdb-api.com/en/API/YouTubeTrailer/k_9ladwrec/${results[i].imdbid}`)
            .then(function (response) {
              return response.json()
            })
            .then(function (videoData) {
              if (videoData.videoUrl){
                window.location.assign(videoData.videoUrl)
              }else{
                var noTrailerSight = document.getElementById(results[i].imdbid);
                noTrailerSight.textContent = "No Youtube Trailer";
              }
          })
        })
    }    
}


form.addEventListener('submit', function(event){
    event.preventDefault();
    let searchTerm = search.value

    selectedGenre = [];
    setYear();

    if(searchTerm && searchTerm !== ''){
        getMovies(search_api + searchTerm)
        search.value = ''
    }else {
        window.location.reload()
    }
})