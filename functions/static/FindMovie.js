var page = 1;
var currentMovieJSON;

async function displayMovie(MovieName, Year = null) {
  // Get single movie result from OMDB API
  let omdbKey = "46fcc81f";
  let omdbURL = `https://www.omdbapi.com/?t=${MovieName}&type=movie`;
  if (Year !== null) {
    omdbURL += `&y=${Year}`;
  }
  omdbURL += `&apikey=${omdbKey}`;
  let movieResponse = await fetch(omdbURL);

  let movie = document.getElementById("movie-info");
  // Erase previous contents (if applicable)
  while (movie.firstChild) {
    movie.removeChild(movie.firstChild);
  }

  let movieData = await movieResponse.json();
  console.log(movieData);
  if (movieResponse.ok && movieData["Response"] === "True") {
    // Movie found
    /*
            <div id="movie-info">
                <img src=${movie poster url} alt="Movie Poster">
                <p>${movie title} (${movie year}, Rated {movie age rating}, ${movie duration})</p>
            </div>
        */

    // Update with new movie
    let poster = document.createElement("img");
    poster.setAttribute("src", movieData["Poster"]);
    poster.setAttribute("alt", `Movie Poster`);
    movie.appendChild(poster);

    let caption = document.createElement("p");
    let captionText = document.createTextNode(
      `${movieData["Title"]} (${movieData["Year"]}, Rated ${
        movieData["Rated"]
      }, ${movieData["Runtime"]})`
    );
    caption.appendChild(captionText);
    movie.appendChild(caption);
  } else {
    // Movie not found
    /*
            <div id="movie">
                <p>"${movie title}" not found!</p>
            </div>
        */
    let result = document.createElement("h1");
    result.setAttribute(
      "style",
      "color: white; margin-top:1em;margin-left:0.5em"
    );
    let resultText = document.createTextNode("No Information Available");
    result.appendChild(resultText);
    movie.appendChild(result);
  }
  currentMovieJSON = movieData;
  displayMovieTable(movieData);
}

function displayMovieTable(movieData) {
  let table = document.getElementById("movie-info-table");
  table.setAttribute('color', 'white');

  // Create IMDB rating row
  let imdbRow = document.getElementById("movie-info-imdb-rating");
  let imdbHdr = document.createElement("th");
  let imdbHdrText = document.createTextNode("IMDB Rating");
  let imdbNode = document.createElement("td");
  let imdbText = document.createTextNode(movieData["imdbRating"]);
  imdbHdr.appendChild(imdbHdrText);
  imdbNode.appendChild(imdbText);
  imdbRow.appendChild(imdbHdr);
  imdbRow.appendChild(imdbNode);

  // Create director row
  let dirRow = document.getElementById("movie-info-director");
  let dirHdr = document.createElement("th");
  let dirHdrText = document.createTextNode("Director");
  let dirNode = document.createElement("td");
  let dirText = document.createTextNode(movieData["Director"]);
  dirHdr.appendChild(dirHdrText);
  dirNode.appendChild(dirText);
  dirRow.appendChild(dirHdr);
  dirRow.appendChild(dirNode);

  // Create plot row
  let plotRow = document.getElementById("movie-info-plot");
  let plotHdr = document.createElement("th");
  let plotHdrText = document.createTextNode("Plot Summary");
  let plotNode = document.createElement("td");
  let plotText = document.createTextNode(movieData["Plot"]);
  plotHdr.appendChild(plotHdrText);
  plotNode.appendChild(plotText);
  plotRow.appendChild(plotHdr);
  plotRow.appendChild(plotNode);

  // Create genre row
  let genreRow = document.getElementById("movie-info-genre");
  let genreHdr = document.createElement("th");
  let genreHdrText = document.createTextNode("Genres");
  let genreNode = document.createElement("td");
  let genreText = document.createTextNode(movieData["Genre"]);
  genreHdr.appendChild(genreHdrText);
  genreNode.appendChild(genreText);
  genreRow.appendChild(genreHdr);
  genreRow.appendChild(genreNode);

  // Create release date row
  let releaseRow = document.getElementById("movie-info-release");
  let releaseHdr = document.createElement("th");
  let releaseHdrText = document.createTextNode("Release Date");
  let releaseNode = document.createElement("td");
  let releaseText = document.createTextNode(movieData["Released"]);
  releaseHdr.appendChild(releaseHdrText);
  releaseNode.appendChild(releaseText);
  releaseRow.appendChild(releaseHdr);
  releaseRow.appendChild(releaseNode);

  // Create Rating row
  let ratedRow = document.getElementById("movie-info-rated");
  let ratedHdr = document.createElement("th");
  let ratedHdrText = document.createTextNode("Rated");
  let ratedNode = document.createElement("td");
  let ratedText = document.createTextNode(movieData["Rated"]);
  ratedHdr.appendChild(ratedHdrText);
  ratedNode.appendChild(ratedText);
  ratedRow.appendChild(ratedHdr);
  ratedRow.appendChild(ratedNode);

  // Create runtime row
  let runtimeRow = document.getElementById("movie-info-runtime");
  let runtimeHdr = document.createElement("th");
  let runtimeHdrText = document.createTextNode("Runtime");
  let runtimeNode = document.createElement("td");
  let runtimeText = document.createTextNode(movieData["Runtime"]);
  runtimeHdr.appendChild(runtimeHdrText);
  runtimeNode.appendChild(runtimeText);
  runtimeRow.appendChild(runtimeHdr);
  runtimeRow.appendChild(runtimeNode);

}

async function showMoreMovies() {
  let movieList = document.getElementById("movie-info-list");
  // Bring up the next 10 search results
  let urlParams = new URLSearchParams(window.location.search);
  let movieName;
  if (urlParams.has("search")) {
    movieName = urlParams.get("search");
  } else {
    alert(`Invalid Input, missing movie name`);
  }

  // TODO: Don't keep sending queries if no more results to show

  let omdbKey = "46fcc81f";
  let omdbURL = `https://www.omdbapi.com/?s=${movieName}&type=movie&page=${page}`;
  omdbURL += `&apikey=${omdbKey}`;
  let movies = await fetch(omdbURL);
  if (movies.ok) {
    movies = await movies.json();
    // Array of movies with title, year, type, poster, imdbID
    movies = movies["Search"]; // Array of movies

    /*
            <ul id="movie-info-list">
                ...
                <li>
                    <a onclick="displayMovie(${movie title}, ${movie year})">${movie title} (${movie year})</a>
                </li>
                ...
            </ul>
        */
    // Add search results to list
    // i = 0 is current movie (don't show)
    for (let i = 1; movies !== undefined && i < movies.length; i++) {
      let movieData = movies[i];
      let elem = document.createElement("li");
      let link = document.createElement("a");
      link.setAttribute(
        "onclick",
        `updateMovie(\'${movieData["Title"]}\', \'${movieData["Year"]}\')`
      );
      link.innerText = `${movieData["Title"]} (${movieData["Year"]})`;
      elem.appendChild(link);
      movieList.appendChild(elem);
    }
  } else {
    // Do not add to list
  }

  page++;
}

function updateMovie(MovieName, Year) {
  // Change search parameters when link is clicked (no refresh)
  if (window.history.replaceState) {
    //prevents browser from storing history with each change:
    window.history.replaceState(window.history.state, "", `/FindMovie/?search=${MovieName}`);
  }
  
  // Erase all data from the previous movie
  let movieList = document.getElementById("movie-info-list");
  while (movieList.firstChild) {
    movieList.removeChild(movieList.firstChild);
  }

  let imdbRow = document.getElementById("movie-info-imdb-rating");
  while (imdbRow.firstChild) {
    imdbRow.removeChild(imdbRow.firstChild);
  }

  let dirRow = document.getElementById("movie-info-director");
  while (dirRow.firstChild) {
    dirRow.removeChild(dirRow.firstChild);
  }

  let plotRow = document.getElementById("movie-info-plot");
  while (plotRow.firstChild) {
    plotRow.removeChild(plotRow.firstChild);
  }

  let genreRow = document.getElementById("movie-info-genre");
  while (genreRow.firstChild) {
    genreRow.removeChild(genreRow.firstChild);
  }

  let releaseRow = document.getElementById("movie-info-release");
  while (releaseRow.firstChild) {
    releaseRow.removeChild(releaseRow.firstChild);
  }

  let ratedRow = document.getElementById("movie-info-rated");
  while (ratedRow.firstChild) {
    ratedRow.removeChild(ratedRow.firstChild);
  }

  let runtimeRow = document.getElementById("movie-info-runtime");
  while (runtimeRow.firstChild) {
    runtimeRow.removeChild(runtimeRow.firstChild);
  }

  displayMovie(MovieName, Year);
}

function searchAgain() {
  // TODO: Redirect to specific user
  window.location.replace("/Home");
}
