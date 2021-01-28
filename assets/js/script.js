// Movie names
var movieNamesObj = ['Django Unchained', 'Once upon a time... in Hollywood', 'Pulp Fiction', 'Maze Runner', 'Deadpool', 'Crazy Rich Asians', 'A Star is Born', 'Bohemian Rhapsody', 
'Jaws', 'Rocky', 'Back to the Future', 'The Notebook', 'V for Vendetta', 'Indiana Jones and the Raiders of the Lost Ark', 'Forgetting Sarah Marshall', 'Anchorman: The Legend of Ron Burgundy', 'Borat', 'Big','Tenet', 'The Dark Knight', 'Old School', 'Midsommar', 'Goodfellas', 'Casino', 'Black Mass'];

// incorrect answers
var wrongActors = ["Tom Hanks", "Will Smith", "Leonardo DiCaprio", "Morgan Freeman", "Brad Pitt", "Denzel Washington", "Johnny Depp", "Harrison Ford", "Tom Cruise", "Brody Cambert", "Matt Damon", "Keanu Reeves", "Jack Nicholson", "Meryl Streep", "Natalie Portman", "Charlize Theron", "Emma Stone", "Viola Davis", "Brie Larson", "Octavia Spencer", "Amy Adams", "Drew Barrymore", "Jennifer Garner", "Sigourney Weaver", "Audrey Hepburn", "Betty Davis","George Takei", "Sacha Baron Cohen", "Lisa Kudrow", "Tim Roth", "Maya Rudolph", "Dirk Benedict", "Jennifer Lawrence", "Christoph Waltz", "Selma Blair", "Ruth Wilson","Elizabeth Hurley", "Channing Tatum", "Russel Crowe", "Russell Brand", "Jonah Hill"];

//gif Array
var gifArray = ["https://media.giphy.com/media/3oeSAXCqOrDqoYlwqs/giphy.gif", "https://media.giphy.com/media/l3fZJroOW8RAafbc4/giphy.gif", "https://media.giphy.com/media/1455m6M8jFgCE8/giphy.gif", "https://media.giphy.com/media/IgsXOXGPxfT3O/giphy.gif", "https://media.giphy.com/media/fxgVuoKyZwEOudRXuj/giphy.gif", "https://media.giphy.com/media/3o85xyklT2t8VVjxxC/giphy.gif", "https://media.giphy.com/media/NWb5QtGBdfQyY/giphy.gif", "https://media.giphy.com/media/5WmyaeDDlmb1m/giphy.gif", "https://media.giphy.com/media/f6x9yOwdtxu1y/giphy.gif", "https://media.giphy.com/media/8NQ7T1ExRuMz6/giphy.gif", 'https://media.giphy.com/media/WzN55eG5zQ9w8MPGZs/giphy.gif']

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

//current score
var scoreNum = document.getElementById("score-num");
    if (scoreNum !== null){
        scoreNum.textContent=score;
    }

// current location check
var currentLocation = window.location.pathname;
console.log(currentLocation);
if (currentLocation.includes('/highscores/highscores.html')) {

    // checks for high scores, if there are no highscores... else...
    if (highScoresArray[0] == null) {
        console.log('empty');
        var heading = document.querySelector('#highScoreHeading');
        heading.textContent = 'There are no scores yet!';
    }  
    else {

        //display the Clear button
        var clearBtnEl = document.getElementById("clearButton");
            clearBtnEl.setAttribute("class", "pure-button mt-1");
            clearBtnEl.addEventListener("click", function(){
                localStorage.clear();
                window.location.reload();
            })

        // heading display
        var heading = document.querySelector('#highScoreHeading');
        heading.textContent = "Highscores:";

        //sort scores
        highScoresArray.sort(
            (a, b) => (parseInt(a.score) < parseInt(b.score)) ? 1 : -1
            );

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
    // if number hasn't been used, all numbers have been used, and if the local storage already has values in it, add new number to arr and fetch the movie associated with that value
    arr.push(rando);
    localStorage.setItem('randomNumbers', JSON.stringify(arr));
    fetchFun(rando);
};


// append data to page
var appendItems = function(data) {
    
    var answerUl = document.querySelector('#answerChoices');
    answerArray = []

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
 
        // answerUl.appendChild(listEl);
        answerArray.push(listEl);
    }

    var listEl = document.createElement('li');
    listEl.setAttribute('class', 'pure-menu-item pure-menu-link');
    listEl.setAttribute('id', 'incorrect');

    var listEl2 = document.createElement('li');
    listEl2.setAttribute('class', 'pure-menu-item pure-menu-link');
    listEl2.setAttribute('id', 'incorrect');

    //randomize wrong Actor and append to page
    var numbers = getTwoRandomNumbers();
    var number = numbers[0];
    var numberTwo = numbers[1];
    var checker = checkNumbers(number, numberTwo);
    while (checker) {
        numberTwo = Math.floor(Math.random() * Math.floor(wrongActors.length));
        checker = checkNumbers(number, numberTwo);
    }
     var checkActor = actorChecker(wrongActors[number], wrongActors[numberTwo], actors);
     while (checkActor === 'actor1'){
        number = Math.floor(Math.random() * Math.floor(wrongActors.length));
        checker = checkNumbers(number, numberTwo);
        while (checker) {
            number = Math.floor(Math.random() * Math.floor(wrongActors.length));
            checker = checkNumbers(number, numberTwo);
        }
        checkActor = actorChecker(wrongActors[number], wrongActors[numberTwo], actors);
     }
     while (checkActor === 'actor2') {
        numberTwo = Math.floor(Math.random() * Math.floor(wrongActors.length));
        checker = checkNumbers(number, numberTwo);
        while (checker) {
            numberTwo = Math.floor(Math.random() * Math.floor(wrongActors.length));
            checker = checkNumbers(number, numberTwo);
        }
        checkActor = actorChecker(wrongActors[number], wrongActors[numberTwo], actors);
     }
    
    listEl.textContent = wrongActors[number];
    listEl2.textContent = wrongActors[numberTwo];
    var answerUl = document.querySelector('#answerChoices');
    // answerUl.appendChild(listEl);
    getRandomNumber();

    // push list items to array
    answerArray.push(listEl);
    answerArray.push(listEl2);
    shuffle(answerArray);
    console.log(answerArray);

    for (i=0; i < answerArray.length; i++) {
        answerUl.appendChild(answerArray[i])
    }
};


// click event
var answerChoices = document.querySelector('#answerChoices');
if (answerChoices !== null) {
    answerChoices.addEventListener('click', function() {
        var answerChoice = event.target;
        if (answerChoice.id === 'correct') {
            answerChoice.setAttribute('class', 'bg-green pure-menu-item pure-menu-link');
            playSound(answerChoice);
            score++;
            scoreNum.textContent = score;
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
            playSound(answerChoice);
            score--;
            scoreNum.textContent = score;
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
                gifImg.setAttribute("class", "pure-img")
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
                gifImg.setAttribute("class", "pure-img")
                gifImg.setAttribute("src", gifArray[number]);
        
                // Append 'gifImg' to the <div>
                gifDisplay.appendChild(gifImg);
                setTimeout(function(){console.log('end')}, 3000);
                endGame();
            }
            var correctAnsChoice = document.querySelectorAll('#correct');
            for (i=0; i < correctAnsChoice.length; i++) {
                correctAnsChoice[i].setAttribute('id', '');
            }

        }
        localStorage.setItem('score', score);
        console.log(score);
    });
}

var displayGif = function() {

  var searchTermMovie = document.getElementById("movieName").textContent;
  var searchTermActor = event.target.textContent;

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
      gifImg.setAttribute("class", "pure-img")
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
    var storedName = JSON.parse(localStorage.getItem("username"));
    
    for (i=0; i<highScoresArray.length; i++) {
        if (storedName === highScoresArray[i].username) {
            
            console.log(highScoresArray[i].score);
            if (Number(storedScore) < Number(highScoresArray[i].score)) {
                storedScore = highScoresArray[i].score;
                
            }
            highScoresArray.splice(i, 1);
        } 
    }

    
    
    var currentScore = {username: storedName, score: storedScore};

    highScoresArray.push(currentScore);
    localStorage.setItem("highscores", JSON.stringify(highScoresArray));
    score = 0;
    localStorage.setItem('score', JSON.stringify(score));
}

var currentLocation = window.location.pathname;
console.log(currentLocation);
if (currentLocation === 'highscores/highscores.html') {
    console.log('hello');
}
if (currentLocation.includes('/moviegame.html')) {
    getMovieData();
}


var nextQuestion = function () {
    qCount++;
    localStorage.setItem('qCount', qCount);

    if (qCount <= 5) { 
        location.reload();
        return;
    } 
    endGame();
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }



  var checkNumbers = function(num1, num2) {
      if (num1 === num2) {
          return true;
      }
      return false;
  }

  var actorChecker = function(actor1, actor2, arr) {
      if (arr.includes(actor1)) {
          console.log(actor1);
        return 'actor1';
      } else if (arr.includes(actor2)) {
          console.log(actor2);
        return 'actor2';
      }
      return false;
  }

var getTwoRandomNumbers = function() {
    var number = Math.floor(Math.random() * Math.floor(wrongActors.length));
    var numberTwo = Math.floor(Math.random() * Math.floor(wrongActors.length));

    return [number, numberTwo];
  }

var playSound = function(answerChoice) {
    mySound = document.getElementById("sound");   
    mySound2 = document.getElementById("sound2");  
    correctButton = document.getElementById("correct");    
    incorrectButton = document.getElementById("incorrect");  
    if (answerChoice.id === "correct") {
        mySound.play(); 
    }
    else if (answerChoice.id === "incorrect"){
        mySound2.play();
    }
}
