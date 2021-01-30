// Movie names
var movieNamesObj = ['Django Unchained', 'Once upon a time... in Hollywood', 'Pulp Fiction', 'Maze Runner', 'Deadpool', 'Crazy Rich Asians', 'A Star is Born', 'Bohemian Rhapsody', 
'Jaws', 'Rocky', 'Back to the Future', 'The Notebook', 'V for Vendetta', 'Indiana Jones and the Raiders of the Lost Ark', 'Forgetting Sarah Marshall', 'Anchorman: The Legend of Ron Burgundy', 'Borat', 'Big','Tenet', 'The Dark Knight', 'Old School', 'Midsommar', 'Goodfellas', 'Casino', 'Black Mass'];

// incorrect answers
var wrongActors = ["Tom Hanks", "Will Smith", "Leonardo DiCaprio", "Morgan Freeman", "Brad Pitt", "Denzel Washington", "Johnny Depp", "Harrison Ford", "Tom Cruise", "Brody Cambert", "Matt Damon", "Keanu Reeves", "Jack Nicholson", "Meryl Streep", "Natalie Portman", "Charlize Theron", "Emma Stone", "Viola Davis", "Brie Larson", "Octavia Spencer", "Amy Adams", "Drew Barrymore", "Jennifer Garner", "Sigourney Weaver", "Audrey Hepburn", "Betty Davis","George Takei", "Sacha Baron Cohen", "Lisa Kudrow", "Tim Roth", "Maya Rudolph", "Dirk Benedict", "Jennifer Lawrence", "Christoph Waltz", "Selma Blair", "Ruth Wilson","Elizabeth Hurley", "Channing Tatum", "Russel Crowe", "Russell Brand", "Jonah Hill"];

//gif Array
var gifArray = ["https://media.giphy.com/media/3oeSAXCqOrDqoYlwqs/giphy.gif", "https://media.giphy.com/media/l3fZJroOW8RAafbc4/giphy.gif", "https://media.giphy.com/media/1455m6M8jFgCE8/giphy.gif", "https://media.giphy.com/media/IgsXOXGPxfT3O/giphy.gif", "https://media.giphy.com/media/fxgVuoKyZwEOudRXuj/giphy.gif", "https://media.giphy.com/media/3o85xyklT2t8VVjxxC/giphy.gif", "https://media.giphy.com/media/NWb5QtGBdfQyY/giphy.gif", "https://media.giphy.com/media/5WmyaeDDlmb1m/giphy.gif", "https://media.giphy.com/media/f6x9yOwdtxu1y/giphy.gif", "https://media.giphy.com/media/8NQ7T1ExRuMz6/giphy.gif", 'https://media.giphy.com/media/WzN55eG5zQ9w8MPGZs/giphy.gif']

// GET SCORE FROM LOCAL STORAGE
var score = localStorage.getItem('score');
// IF SCORE DOES NOT EXIST, SET IT TO 0
if (score == null) {
    score = 0;
    localStorage.setItem('score', score);
}

// GET QCOUNT
var qCount = localStorage.getItem('qCount');
// IF QCOUNT DOES NOT EXIST, SET IT TO 0
if (qCount == null) {
    qCount = 1;
    localStorage.setItem('qCount', qCount);
}

// GET HIGH SCORES FROM LOCAL STORAGE
var highScoresArray = JSON.parse(localStorage.getItem('highscores'));
// IF HIGH SCORES IS NULL, SET IT TO AN EMPTY ARRAY
if (highScoresArray == null) {
    highScoresArray = [];
    localStorage.setItem('highscores', JSON.stringify(highScoresArray));
}

// PUT SCORE ELEMeNT INTO A VARIABLE
var scoreNum = document.getElementById("score-num");
// IF SCORE DOES NOT EXIST, SET IT TO THE SCORE THAT IS IN LOCAL STORAGE
if (scoreNum !== null){
    scoreNum.textContent=score;
}

// current location check
var currentLocation = window.location.pathname;
// CHECK IF WE ARE IN THE HIGH SCORES PAGE
if (currentLocation.includes('/highscores/highscores.html')) {

    // checks for high scores, if there are no highscores... else...
    if (highScoresArray[0] == null) {
        // DISPLAY STRING IF THERE ARE NO HIGH SCORES SaVED
        var heading = document.querySelector('#highScoreHeading');
        heading.textContent = 'There are no scores yet!';
    }  
    else {
        // display the Clear button
        var clearBtnEl = document.getElementById("clearButton");
            clearBtnEl.setAttribute("class", "pure-button mt-1");
            clearBtnEl.addEventListener("click", function(){
                localStorage.clear();
                window.location.reload();
            });
        // heading display
        var heading = document.querySelector('#highScoreHeading');
        heading.textContent = "Highscores:";
        // sort scores
        highScoresArray.sort(
            (a, b) => (parseInt(a.score) < parseInt(b.score)) ? 1 : -1
            );
        // GET UL AND STORE IT IN VARIABLE
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

// GET MOVIE DATA FUNCTION
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
    
    // GET UL FROM HTML AND SET IT TO A vaRIABLE
    var answerUl = document.querySelector('#answerChoices');
    // CREATE AN EMPTY ARRAY FOR THE ANSWERS
    answerArray = [];
    // set movie title
    var movieName = data.Title;
    document.getElementById('movieName').textContent = movieName;
    // get actors
    var actors = data.Actors;
    // seperate actors string into an arr 
    actors = actors.split(', ');
    for (i=0; i<actors.length; i++) {
        var listEl = document.createElement('li');
        listEl.setAttribute('class', 'pure-menu-item pure-menu-link');
        listEl.setAttribute('id', 'correct');
        listEl.textContent = actors[i];
        answerArray.push(listEl);
    }
    // CREATE LIST  ELEMENT FOR FIRST INCORRECT ANsWER
    var listEl = document.createElement('li');
    listEl.setAttribute('class', 'pure-menu-item pure-menu-link');
    listEl.setAttribute('id', 'incorrect');
    // CREATE LIST ELEMENT FOR SECONDE INCORRECT ANSWER
    var listEl2 = document.createElement('li');
    listEl2.setAttribute('class', 'pure-menu-item pure-menu-link');
    listEl2.setAttribute('id', 'incorrect');

    // GET TWO RANDOM NUMBERS TO GET INCORRECT ANSWERS
    var numbers = getTwoRandomNumbers();
    // FIRST NUMBER FROM TWO RANDO NUMBERS FUNCTION
    var number = numbers[0];
    // SECOND NUMBER FROM TWO RANDO NUMBERS FUNCTION
    var numberTwo = numbers[1];
    // SEND CHECKER TO CHECK NUMBERS TO SEE IF THEY'RE THE SAME OR NOT
    var checker = checkNumbers(number, numberTwo);
    // WHILE THE Two NUMBERs ARE THE SAME, RUN THIS coDE
    while (checker) {
        // NEW RANDOM NUMBER
        numberTwo = Math.floor(Math.random() * Math.floor(wrongActors.length));
        // CHECK IF THEY ARE THE SAME
        checker = checkNumbers(number, numberTwo);
    }
    // SEND WRONG ANSWERS AND CORRECT ANSWERS TO FUNCTION TO CHECK IF ANY OF THE INCORRECT ANSWERS ARE ALSO ONE OF THE CORRECT ANSWERS
    var checkActor = actorChecker(wrongActors[number], wrongActors[numberTwo], actors);
    // IF THE actorChecker FUNCTION RETURNS 'actor1' RUN THis CODE until it returns an actor that is not one of the correct answers
    while (checkActor === 'actor1'){
        // NEW RANDOM NUMBER
        number = Math.floor(Math.random() * Math.floor(wrongActors.length));
        // CHECK IF THE NEW NUMBER IS THE SAME AS THE OTHER INCORRECT NUMBER
        checker = checkNumbers(number, numberTwo);
        // WHILE THE Two NUMBERs ARE THE SAME, RUN THIS coDE
        while (checker) {
            // NEW RANDOM NUMBER
            number = Math.floor(Math.random() * Math.floor(wrongActors.length));
            // CHECK IF THEY ARE THE SAME
            checker = checkNumbers(number, numberTwo);
        }
        // RUN actorChecker again to make sure one of the wrong actors is not also one of the correct answers
        checkActor = actorChecker(wrongActors[number], wrongActors[numberTwo], actors);
    }
     // IF THE actorChecker FUNCTION RETURNS 'actor2' RUN THis CODE until it returns an actor that is not one of the correct answers
    while (checkActor === 'actor2') {
         // NEW RANDOM NUMBER
        numberTwo = Math.floor(Math.random() * Math.floor(wrongActors.length));
        // CHeCK IF THE NEW NUMBER IS THE SamE AS THE OTHER INCORRECT NUMBER
        checker = checkNumbers(number, numberTwo);
        // WHILE THE TWO nuMBERs aRE THE saME, RUN THIS CODE
        while (checker) {
            // NEWW RANDOM NUMbER
            numberTwo = Math.floor(Math.random() * Math.floor(wrongActors.length));
            // CHECK IF THE NUMBERS ARE THE SAME
            checker = checkNumbers(number, numberTwo);
        }
        // RUN actorChecker again to make sure one of the wrong actors is not also one of the correct answers
        checkActor = actorChecker(wrongActors[number], wrongActors[numberTwo], actors);
    }
    
    // SET LIST ELEMENTS EquAL TO iNCorRECT ANsWERS
    listEl.textContent = wrongActors[number];
    listEl2.textContent = wrongActors[numberTwo];
    // GET ASNWER CHOICES UL FROM HTML
    var answerUl = document.querySelector('#answerChoices');
    // push list items to array
    answerArray.push(listEl);
    answerArray.push(listEl2);
    // MIX UP THE ANSWERS SO THEY ARE NOT IN THE sAME ORDER EVERY TIME
    shuffle(answerArray);
    // APPEND THE ASNWER CHOICES TO THE UL iN THE HTML
    for (i=0; i < answerArray.length; i++) {
        answerUl.appendChild(answerArray[i])
    }
};


// GET THE ANSWER CHOICES
var answerChoices = document.querySelector('#answerChoices');
// IF THE ANSWER CHOICE SELECTED HAS THE ID
if (answerChoices !== null) {
    // IF THE ANSWER CHOICE IS CLICKED, RUN THIS CODE
    answerChoices.addEventListener('click', function() {
        // SET THE LIST ELEMENT CLICKED TO A VARIABLE
        var answerChoice = event.target;
        // CHECK IF THE ID OF THE LIST ELemeNT IS CORRECT
        if (answerChoice.id === 'correct') {
            // CHANGE THE CLASS OF THE ELEMENT TO ADD BG-GREEN
            answerChoice.setAttribute('class', 'bg-green pure-menu-item pure-menu-link');
            // PlAY THE SOUND DEPENDING ON WHAT ANSWER CHOICE THEY CHOSE
            playSound(answerChoice);
            // ADD TO THE SCORE
            score++;
            // CHANGE THE SCORE ON THE PAGE
            scoreNum.textContent = score;
            // CHANGE THE SCORE IN LOCAL STORAGE
            var localScore = localStorage.getItem('score');
            // IF LOCAL SCORE DOES NOT EXIST, RUN THIS CODE
            if (localScore == null) {
                localStorage.setItem('score', score);
                return;
            }
            // CHANGE THE ID OF ANSWER CHOICE SO IT caNNOT BE CLICKED AGAIN
            answerChoice.setAttribute('id', '');
            // RUN THE DISPLAY GIF FUNCTION
            displayGif();
        // IF THE ANSWER IS INCORRECT, RUN THIS CODE
        } else if (answerChoice.id === 'incorrect') {
            // CHANGE CLASS OF ELEMENT TO HAVE RED Bg
            answerChoice.setAttribute('class', 'bg-red pure-menu-item pure-menu-link');
            // PLAY INCORRECT SOUND
            playSound(answerChoice);
            // SUBTRACT SCORE
            score--;
            // CHANGE SCORE ON PAGE
            scoreNum.textContent = score;
            // UPDATE SCORE IN LOCAL STORAGE
            var localScore = localStorage.getItem('score');
            // CHeck IS SCORE EXISTS IN LOCAL STORAGE
            if (localScore == null) {
                localStorage.setItem('score', score);
                return;
            }
            // GET THE QCOUNT
            var qCount = localStorage.getItem('qCount');
            // CHANGE qCOUNT TO A NUMBER
            var count = parseInt(qCount);
            // IF THE qCOUNT IS LESS THAN OR = TO 4 RUN THIS CODE
            if (count <= 4) {
                // ADD 1 TO THE COUNT
                count++;
                // UPDATE qCOUNT IN LOCAL STORAGE
                localStorage.setItem('qCount', count);
                // Empty out the <div> before we append a GIF to it
                var gifDisplay = document.querySelector("#gif");
                gifDisplay.innerHTML = "";
                //random number based on the length of gifarray
                var number = Math.floor(Math.random() * Math.floor(gifArray.length));
                // CREATE IMG ELEMENT FOR GIF TO BE ADDED TO
                var gifImg = document.createElement("img");
                gifImg.setAttribute("class", "pure-img");
                gifImg.setAttribute("src", gifArray[number]);
                gifImg.setAttribute('class', 'gif-style');
                // Append 'gifImg' to the <div>
                gifDisplay.appendChild(gifImg);
                // page reload
                setTimeout(function(){window.location.reload();}, 3000);
            }
            // IF QCOUNT IS 5 or more
            else {
                // GRAB ELEMENT WITH gif ID
                var gifDisplay = document.querySelector("#gif");
                // Empty out the <div> before we append a GIF to it
                gifDisplay.innerHTML = "";
                //random number
                var number = Math.floor(Math.random() * Math.floor(gifArray.length));
                // CREATE ELEMENT FOR GIF TO BE HELD
                var gifImg = document.createElement("img");
                gifImg.setAttribute("class", "pure-img gif-style")
                gifImg.setAttribute("src", gifArray[number]);
                // Append 'gifImg' to the <div>
                gifDisplay.appendChild(gifImg);
                // LET GIF DISPLAY BEFORE gAME IS ENDED
                setTimeout(function(){endGame()}, 3000);
            }
            // GET ANSWER CHOICES THE HAVE THE CORRECT ID
            var correctAnsChoice = document.querySelectorAll('#correct');
            // CHANGE THEIR ID'S TO AN EMPTY STRING SO THAT WHEN THEY ARE CLICKED NOTHING IS TRIGGERED
            for (i=0; i < correctAnsChoice.length; i++) {
                correctAnsChoice[i].setAttribute('id', '');
            }
            // GET ANSWER CHOICES WITH INCORRECT ID
            var incorrectAnsChoice = document.querySelectorAll('#incorrect');
            // CHANGE ID's OF INCORRECT ANSWERS SO NOTHING HAPPENS WHEN THEY ARE CLICKED
            for (i=0; i < incorrectAnsChoice.length; i++) {
                incorrectAnsChoice[i].setAttribute('id', '');
            }

        }
        // UPDATE SCORE IN LocAL STORAGE
        localStorage.setItem('score', score);
    });
}

// DISPLAY GIF FUNCTION
var displayGif = function() {
    // GET THE NAME OF THE MOVIE
    var searchTermMovie = document.getElementById("movieName").textContent;
    // GET THE NAME OF THE ACTOR
    var searchTermActor = event.target.textContent;
    // CREATE API URL FOR FETCH
    var apiUrl = "https://api.giphy.com/v1/gifs/search?q=" + searchTermMovie + " " + searchTermActor + "&api_key=HvaacROi9w5oQCDYHSIk42eiDSIXH3FN";
    // FETCH THE GIF
    fetch(apiUrl)
        .then(function(response) {
        return response.json();
        })
        .then(function(response) {
        // CHECK IF THE GIFS RETURNED CORRECTLY
        if (response.data == undefined) {
            console.log('NO GIF');
        } else {
            // GET THE ELEMENT WITH THE gif ID
            var gifDisplay = document.querySelector("#gif");
            // Empty out the <div> before we append a GIF to it
            gifDisplay.innerHTML = "";
            // CREATE IMG ELEMENT FOR GIF TO BE ADDED TO
            var gifImg = document.createElement('img');
            gifImg.setAttribute("class", "pure-img")
            gifImg.setAttribute('src', response.data[0].images.fixed_height.url);
            gifImg.setAttribute('class', 'gif-style');
            // Append 'gifImg' to the <div>
            gifDisplay.appendChild(gifImg);
        }
            
    }) 

}

// END GAME FUNCTION
var endGame = function() {
    // CHANGE THE QCOUNT BACK TO 1 FOR NEXT ROUND
    localStorage.setItem("qCount", 1);
    // RUN THE HIGH SCORES FUNCTION
    highScores();
    // TaKE USER TO THE HIGHSCORES PAGE
    window.location.replace('../highscores/highscores.html');
}

// HIGH SCOREs FUNCTION
var highScores = function() {
    // GET SCORE FROM LocAL STORAGE
    var storedScore = localStorage.getItem("score");
    // GET STORED USER NAME
    var storedName = JSON.parse(localStorage.getItem("username"));
    // FOR LOOP TO CHECK USERS LAST SCORE IS GREATER THAN THEIR PREVIOUS SCORE
    for (i=0; i<highScoresArray.length; i++) {
        // CHECK IF USER hAS PREVIOUSLY PLAYED THE GAME
        if (storedName === highScoresArray[i].username) {
            // CHECK iF SCORE IN LOCAL STORAGE IS GREATER THAN CURRENT sCORE
            if (Number(storedScore) < Number(highScoresArray[i].score)) {
                // CHANGE THE SCORE
                storedScore = highScoresArray[i].score;
                
            }
            // REMOVE THE OBJECT FROM THE ARRAY
            highScoresArray.splice(i, 1);
        } 
    }
    // create a current scores object
    var currentScore = {username: storedName, score: storedScore};
    // push current scores to high scores arr
    highScoresArray.push(currentScore);
    // update the high scores in local storage
    localStorage.setItem("highscores", JSON.stringify(highScoresArray));
    // change the score back to 0 for next round
    score = 0;
    // update score in local storage
    localStorage.setItem('score', JSON.stringify(score));
}

// check which page we are currently on
var currentLocation = window.location.pathname;
// IF WE ARE ON THE moviegame page run this code
if (currentLocation.includes('/moviegame.html')) {
    // run the game
    getMovieData();
}

// nextQuestion FUNCTIOn
var nextQuestion = function () {
    // increase qCOunt
    qCount++;
    // update Qcount
    localStorage.setItem('qCount', qCount);
    // if the qcount is 5 or less, run this code
    if (qCount <= 5) { 
        location.reload();
        return;
    } 
    endGame();
}

// shuffle function
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

// check numbers function
var checkNumbers = function(num1, num2) {
      if (num1 === num2) {
          return true;
      }
      return false;
}

// actor checker function
var actorChecker = function(actor1, actor2, arr) {
    
    if (arr.includes(actor1)) {
        // return actor1 if the actors arr includes the incorrect actor
        return 'actor1';
    } else if (arr.includes(actor2)) {
        // return actor2 if the actors arr includes the incorrect actor
        return 'actor2';
    }
    // if neither of the actors are in the arr return false
    return false;
}

// get two rando numbers
var getTwoRandomNumbers = function() {
    var number = Math.floor(Math.random() * Math.floor(wrongActors.length));
    var numberTwo = Math.floor(Math.random() * Math.floor(wrongActors.length));
    // return arr of random numbers
    return [number, numberTwo];
}

// play sound function
var playSound = function(answerChoice) {
    // get sounds from html AND set them to variables
    mySound = document.getElementById("sound");   
    mySound2 = document.getElementById("sound2");
    // get correct and incorrect buttons from HTML
    correctButton = document.getElementById("correct");    
    incorrectButton = document.getElementById("incorrect");  
    // if the id of the answer choice clicked is correct, play this sound
    if (answerChoice.id === "correct") {
        mySound.play(); 
    }
    // if the if of the answer choice clicked is incorrect, play this sound
    else if (answerChoice.id === "incorrect"){
        mySound2.play();
    }
}
