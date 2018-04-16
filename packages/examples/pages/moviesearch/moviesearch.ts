import DeltaWatch from 'delta-watch';

interface MovieInfo {
  Title: string
  Year: string
  imdbID: string
}

// Also the page size of OMDb's search query, which currently isn't configurable
let rowCount = 10;

window.addEventListener('load', () => {
  const tableBody = document.getElementById('movieTable');
  const searchTextInput = document.getElementById('searchText');
  const searchSubmitBtn = document.getElementById('searchSubmit');

  const movieData = DeltaWatch.Watchable({
    searchText: "Star",
    movies: [],
    currentPage: 0
  });

  const {Watcher, Accessor, Mutator} = movieData;

  // Generate table rows
  for (let i = 0; i < rowCount; i++) {
    let rowEle = document.createElement('tr');
    rowEle.classList.add('hide');

    let titleCell = document.createElement('td');
    titleCell.innerHTML = '&mdash;';

    let yearCell = document.createElement('td');
    yearCell.classList.add('center-align');
    yearCell.innerHTML = '&mdash;';

    let imdbCell = document.createElement('td');
    imdbCell.classList.add('center-align');
    let imdbLink = document.createElement('a');

    imdbLink.classList.add("orange-text", "text-accent-2");
    imdbLink.setAttribute('href', '#');
    imdbLink.setAttribute('target', '_blank');
    imdbLink.innerHTML = "Go";

    imdbCell.appendChild(imdbLink);

    rowEle.appendChild(titleCell);
    rowEle.appendChild(yearCell);
    rowEle.appendChild(imdbCell);

    tableBody.appendChild(rowEle);

    // Single watcher per row matching its corresponding slot in movies array
    DeltaWatch.Watch(Watcher.movies[i], (movieInfo: MovieInfo) => {
      if (!movieInfo) {
        rowEle.classList.add('hide');
      } else {
        rowEle.classList.remove('hide');

        titleCell.innerHTML = movieInfo.Title;
        yearCell.innerHTML = movieInfo.Year;
        imdbLink.setAttribute('href', `http://www.imdb.com/title/${movieInfo.imdbID}`)
      }
    });
  }

  // Mutations

  function searchOMDb() {
    fetch(`//www.omdbapi.com/?apikey=650ad66d&s=${Accessor.searchText}&page=1`)
      .then((response) => response.json())
      .then((data) => {
        Mutator.movies = data.Search;
        Mutator.totalResults = data.totalResults;
      });
  }

  searchTextInput.addEventListener('input', (event) => {
    let value = (event.target as HTMLInputElement).value;
    Mutator.searchText = value;
    if (value.trim() === "") {
      searchSubmitBtn.setAttribute('disabled','');
    } else {
      searchSubmitBtn.removeAttribute('disabled');
    }
  });

  searchSubmitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    searchOMDb();
  })
});