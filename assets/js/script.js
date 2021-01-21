// Movie names
var movieNamesObj = ['Django Unchained', 'Once upon a time... in Hollywood', 'Black Panther', 'Maze Runner', 'Deadpool', 'Crazy Rich Asians', 'A Star is Born', 'Bohemian Rhapsody', 
'Jaws', 'Rocky', 'Back to the Future'];
// Get a random number to send into getMovieData
var getRandomNumber = function() {
    var number = Math.floor(Math.random() * Math.floor(movieNamesObj.length));
    return number;
}

// Establish api key and fetch actors of movie from API
var apikey = 'http://www.omdbapi.com/?i=tt3896198&apikey=da94de50';
var getMovieData = function() {
    var rando = getRandomNumber();
    checkMovie(rando);
    console.log(rando);
    fetch(apikey+'&t='+movieNamesObj[rando]).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        })
    })
};

// check if the random number that has been generated, has already been used
var  checkMovie = function(rando) {
    var randomNumbersUsed = localStorage.getItem('randomNumbers');
    if(randomNumbersUsed == null) {
        var arr = [];
        arr.push(rando);
        localStorage.setItem('randomNumbers', JSON.stringify(arr));
        return;
    }
    var arr = []; 
    arr = JSON.parse(randomNumbersUsed);
    if (arr.length === movieNamesObj.length) {
        localStorage.removeItem('randomNumbers');
    }
    for (i = 0; i < arr.length; i++) {
        if (rando === arr[i]) {
            getMovieData();
            return;
        }
    }
    arr.push(rando);
    localStorage.setItem('randomNumbers', JSON.stringify(arr));
}
getMovieData();