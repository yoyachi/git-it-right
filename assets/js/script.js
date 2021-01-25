// Movie names
var movieNamesObj = ['Django Unchained', 'Once upon a time... in Hollywood', 'Black Panther', 'Maze Runner', 'Deadpool', 'Crazy Rich Asians', 'A Star is Born', 'Bohemian Rhapsody', 
'Jaws', 'Rocky', 'Back to the Future'];

// incorrect answers
var wrongActors = ["Tom Hanks", "Will Smith", "Leonardo DiCaprio", "Morgan Freeman", "Brad Pitt", "Denzel Washington", 
"Johnny Depp", "Harrison Ford", "Tom Cruise", "Al Pacino", "Matt Damon", "Keanu Reeves", "Jack Nicholson", "Meryl Streep", 
"Natalie Portman", "Charlize Theron", "Emma Stone", "Viola Davis", "Brie Larson", "Octavia Spencer", "Amy Adams", "Drew Barrymore", 
"Jennifer Garner", "Sigourney Weaver", "Audrey Hepburn", "Betty Davis"];

//gif Array
var gifArray = ["https://media.giphy.com/media/3oeSAXCqOrDqoYlwqs/giphy.gif", "https://media.giphy.com/media/l3fZJroOW8RAafbc4/giphy.gif", "https://media.giphy.com/media/1455m6M8jFgCE8/giphy.gif", "https://media.giphy.com/media/IgsXOXGPxfT3O/giphy.gif", "https://media.giphy.com/media/fxgVuoKyZwEOudRXuj/giphy.gif", "https://media.giphy.com/media/3o85xyklT2t8VVjxxC/giphy.gif", "https://media.giphy.com/media/NWb5QtGBdfQyY/giphy.gif", "https://media.giphy.com/media/5WmyaeDDlmb1m/giphy.gif", "https://media.giphy.com/media/f6x9yOwdtxu1y/giphy.gif", "https://media.giphy.com/media/8NQ7T1ExRuMz6/giphy.gif"]

//score
var score = localStorage.getItem('score');
if (score == null) {
    score = 0;
    localStorage.setItem('score', score);
}

//question number
var qCount = localStorage.getItem('qCount');
if (qCount == null) {
    qCount = 1;
    localStorage.setItem('qCount', qCount);
}

//high scores array
var highScoresArray = JSON.parse(localStorage.getItem('highscores'));
if (highScoresArray == null) {
    highScoresArray = [];
    localStorage.setItem('highscores', JSON.stringify(highScoresArray));
}


// current location check
var currentLocation = window.location.pathname;
console.log(currentLocation);
if (currentLocation.includes('/highscores/highscores.html')) {

    if (highScoresArray[0] == null) {
        console.log('empty');
        var heading = document.querySelector('#highScoreHeading');
        heading.textContent = 'There are no scores yet!';
        
    }  
    else {

        // heading display
        var heading = document.querySelector('#highScoreHeading');
        heading.textContent = "Highscores:";

        //sort scores
        highScoresArray.sort((a, b) => (a.score < b.score) ? 1 : -1);

        var scoresList = document.querySelector("#highscores");

        //add scores to list
        for (var i = 0; i < highScoresArray.length; i++) {
            var displayScore = document.createElement("li");
                displayScore.textContent = highScoresArray[i].username + " - " + highScoresArray[i].score;
                displayScore.setAttribute('class', 'pure-u pure-menu-item pure-menu-link');
                scoresList.appendChild(displayScore);
        }
    }
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
if (answerChoices !== null) {
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
            // score--;
            var localScore = localStorage.getItem('score');
            if (localScore == null) {
                localStorage.setItem('score', score);
                return;
            }

            var qCount = localStorage.getItem('qCount')
            var count = parseInt(qCount);
            console.log(count);
            if (count <= 4) {
                count++;
                localStorage.setItem('qCount', count);
                // Empty out the <div> before we append a GIF to it
                var gifDisplay = document.querySelector("#gif");
                gifDisplay.innerHTML = "";
                
                //random number
                var number = Math.floor(Math.random() * Math.floor(gifArray.length));
            
                var gifImg = document.createElement("img");
                gifImg.setAttribute("src", gifArray[number]);
        
                // Append 'gifImg' to the <div>
                gifDisplay.appendChild(gifImg);

                // page reload
                setTimeout(function(){window.location.reload();}, 3000);
            }
            else {
                var gifDisplay = document.querySelector("#gif");
                // Empty out the <div> before we append a GIF to it
                gifDisplay.innerHTML = "";
            
                //random number
                var number = Math.floor(Math.random() * Math.floor(gifArray.length));
            
                var gifImg = document.createElement("img");
                gifImg.setAttribute("src", gifArray[number]);
        
                // Append 'gifImg' to the <div>
                gifDisplay.appendChild(gifImg);
                setTimeout(function(){console.log('end')}, 2000);
                endGame();
            }
                

        }
        localStorage.setItem('score', score);
        console.log(score);
    });
}

var displayGif = function() {


  // Create a variable that will use `document.querySelector()` to target the `id` of the input 
  // Use `.value` to capture the value of the input and store it in the variable
  var searchTermMovie = document.getElementById("movieName").textContent;
  var searchTermActor = event.target.textContent;

  // Make a `fetch` request concatenating that variable to the query URL
  var apiUrl = "https://api.giphy.com/v1/gifs/search?q=" + searchTermMovie + " " + searchTermActor + "&api_key=HvaacROi9w5oQCDYHSIk42eiDSIXH3FN";

  fetch(apiUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      console.log(response.data[0]);
      
      var gifDisplay = document.querySelector("#gif");
      
      // Empty out the <div> before we append a GIF to it
      gifDisplay.innerHTML = "";
      
      var gifImg = document.createElement('img');
      gifImg.setAttribute('src', response.data[0].images.fixed_height.url);
     
      // Append 'gifImg' to the <div>
      gifDisplay.appendChild(gifImg)  ;   
  }) 

}

var endGame = function() {
    
    localStorage.setItem("qCount", 1);
    highScores();
    window.location.replace('../highscores/highscores.html');
}

var highScores = function() {

    
    var storedScore = localStorage.getItem("score");
    var storedName =JSON.parse(localStorage.getItem("username"));
    
    var currentScore = {username: storedName, score: storedScore};

    console.log(currentScore);
    highScoresArray.push(currentScore);
    localStorage.setItem("highscores", JSON.stringify(highScoresArray));
    score = 0;
    localStorage.setItem('score', JSON.stringify(score));

    // var scoreEl = document.querySelector(".info")

    //  // if there are no high scores tell user and display Go Back button
    //  if (!storedScore) {
    //     var displayScore = document.createElement("h3");
    //         displayScore.setAttribute("class", "pure-u")
    //         displayScore.textContent = "No scores yet...";
    //         scoreEl.appendChild(displayScore);
    // }  

}

var currentLocation = window.location.pathname;
console.log(currentLocation);
if (currentLocation === 'highscores/highscores.html') {
    console.log('hello');
}
if (currentLocation.includes('/moviegame.html')) {
    getMovieData();
}


