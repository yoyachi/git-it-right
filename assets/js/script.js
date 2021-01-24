// Movie names
var movieNamesObj = ['Django Unchained', 'Once upon a time... in Hollywood', 'Black Panther', 'Maze Runner', 'Deadpool', 'Crazy Rich Asians', 'A Star is Born', 'Bohemian Rhapsody', 
'Jaws', 'Rocky', 'Back to the Future'];


var wrongActors = ["Tom Hanks", "Will Smith", "Leonardo DiCaprio", "Morgan Freeman", "Brad Pitt", "Denzel Washington", 
"Johnny Depp", "Harrison Ford", "Tom Cruise", "Al Pacino", "Matt Damon", "Keanu Reeves", "Jack Nicholson", "Meryl Streep", 
"Natalie Portman", "Charlize Theron", "Emma Stone", "Viola Davis", "Brie Larson", "Octavia Spencer", "Amy Adams", "Drew Barrymore", 
"Jennifer Garner", "Sigourney Weaver", "Audrey Hepburn", "Betty Davis"];

var score = localStorage.getItem('score');
if (score == null) {
    score = 0;
    localStorage.setItem('score', score);
}


// Get a random number to send into getMovieData
var getRandomNumber = function() {
    var number = Math.floor(Math.random() * Math.floor(movieNamesObj.length));
    return number;
}
// Fetch function
var fetchFun = function(rando) {
    fetch(apikey+'&t='+movieNamesObj[rando]).then(function(response) {
        response.json().then(function(data) {
            appendItems(data);
        })
    })
};
// Establish api key
var apikey = 'https://www.omdbapi.com/?i=tt3896198&apikey=da94de50';
//
var getMovieData = function() {
    var rando = getRandomNumber();
    checkMovie(rando);
    
};

// check if the random number that has been generated, has already been used
var checkMovie = function(rando) {
    // Get numbers that have been used before
    var randomNumbersUsed = localStorage.getItem('randomNumbers');
    // Check if the arr in local storage has any values in it
    if(randomNumbersUsed == null) {
        var arr = [];
        arr.push(rando);
        localStorage.setItem('randomNumbers', JSON.stringify(arr));
        // Make the fetch call
        fetchFun(rando);
        return;
    }
    // create empty arr if there are values in local storage
    var arr = [];
    // go through each item in local storage and push it to existing arr
    arr = JSON.parse(randomNumbersUsed);
    // Check if all movies have already been used
    if (arr.length === movieNamesObj.length) {
        localStorage.removeItem('randomNumbers');
        getMovieData();
        return;
    }
    // check if the random number has already been used
    for (i = 0; i < arr.length; i++) {
        if (rando === arr[i]) {
            getMovieData();
            return;
        }
    }
    // if number hasn't been used, all numbers have been used, and if the local
    // storage already has values in it, add new number to arr and fetch the movie
    // associated with that value
    arr.push(rando);
    localStorage.setItem('randomNumbers', JSON.stringify(arr));
    fetchFun(rando);
};


// append data to page
var appendItems = function(data) {
    // set movie title
    var movieName = data.Title;
    document.getElementById('movieName').textContent = movieName;
    // get actors
    var actors = data.Actors;
    // seperate string into an arr 
    actors = actors.split(', ');
    for (i=0; i<actors.length; i++) {
        var listEl = document.createElement('li');
        listEl.setAttribute('class', 'pure-menu-item pure-menu-link');
        listEl.setAttribute('id', 'correct');
        listEl.textContent = actors[i];
        var answerUl = document.querySelector('#answerChoices');
        answerUl.appendChild(listEl);
    }
    var listEl = document.createElement('li');
    listEl.setAttribute('class', 'pure-menu-item pure-menu-link');
    listEl.setAttribute('id', 'incorrect');

    //randomize wrongActor and append to page
    var number = Math.floor(Math.random() * Math.floor(wrongActors.length))
    listEl.textContent = wrongActors[number];
    var answerUl = document.querySelector('#answerChoices');
    answerUl.appendChild(listEl);
    getRandomNumber();
};


// click event
var answerChoices = document.querySelector('#answerChoices');
answerChoices.addEventListener('click', function() {
    var answerChoice = event.target;
    if (answerChoice.id === 'correct') {
        answerChoice.setAttribute('class', 'bg-green pure-menu-item pure-menu-link');
        score++;
        var localScore = localStorage.getItem('score');
        if (localScore == null) {
            localStorage.setItem('score', score);
            return;
        }
        answerChoice.setAttribute('id', '');
        console.log(answerChoice);

        displayGif();

    } else if (answerChoice.id === 'incorrect') {
        answerChoice.setAttribute('class', 'bg-red pure-menu-item pure-menu-link');
        score--;
        var localScore = localStorage.getItem('score');
        if (localScore == null) {
            localStorage.setItem('score', score);
            return;
        }

        // page reload
        window.location.reload();
    }
    localStorage.setItem('score', score);
    console.log(score);
});

var displayGif = function() {


  // Create a variable that will use `document.querySelector()` to target the `id` of the input 
  // Use `.value` to capture the value of the input and store it in the variable
  var searchTermMovie = document.getElementById("movieName").textContent;
  var searchTermActor = event.target.textContent;

  // Make a `fetch` request concatenating that variable to the query URL
  var apiUrl = "https://api.giphy.com/v1/gifs/search?q=" + searchTermMovie + " " + searchTermActor + "&api_key=HvaacROi9w5oQCDYHSIk42eiDSIXH3FN"

  fetch(apiUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      console.log(response.data[0]);
      
      var gifDisplay = document.querySelector("#gif")
      
      // Empty out the <div> before we append a GIF to it
      gifDisplay.innerHTML = ""
      
      var gifImg = document.createElement('img');
      gifImg.setAttribute('src', response.data[0].images.fixed_height.url);
     
      // Append 'gifImg' to the <div>
      gifDisplay.appendChild(gifImg)     
  }) 

}


getMovieData();


