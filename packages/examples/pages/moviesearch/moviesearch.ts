import DeltaWatch from 'delta-watch';

declare const M: any; // Materialize CSS global

// Subsets of the data returned from the OMDb API
interface MovieInfo {
  Title: string
  Year: string
  imdbID: string
}

interface MovieDetails {
  Title: string
  Year: string
  Rated: string
  Runtime: string
  Director: string
  Plot: string
  Poster: string
  BoxOffice: string
  imdbID: string
}

// Also the page size of OMDb's search query, which currently isn't configurable
let rowCount = 10;

window.addEventListener('load', () => {

  // Table and pagination elements
  const tableBody = document.getElementById('movieTable');
  const searchTextInput = document.getElementById('searchText');
  const searchSubmitBtn = document.getElementById('searchSubmit');
  const previousPageBtn = document.getElementById('previousPageBtn');
  const previousPageLink = previousPageBtn.children[0];
  const nextPageBtn = document.getElementById('nextPageBtn');
  const nextPageLink = nextPageBtn.children[0];
  const firstPageBtn = document.getElementById('firstPageBtn');
  const firstPageLink = firstPageBtn.children[0];
  const lastPageBtn = document.getElementById('lastPageBtn');
  const lastPageLink = lastPageBtn.children[0];
  const totalResultsText = document.getElementById('totalResultsText');

  // Modal elements
  const movieDetailModal = document.getElementById('movieDetailModal');
  const movieDetailModalInstance = M.Modal.init(movieDetailModal, {}); // Materialize

  const closeMovieDetailModalBtn = document.getElementById('closeMovieDetailModalBtn');
  const movieDetailTitle = document.getElementById('movieDetailTitle');
  const movieDetailYear = document.getElementById('movieDetailYear');
  const movieDetailRated = document.getElementById('movieDetailRated');
  const movieDetailRuntime = document.getElementById('movieDetailRuntime');
  const movieDetailDirector = document.getElementById('movieDetailDirector');
  const movieDetailBoxOffice = document.getElementById('movieDetailBoxOffice');
  const movieDetailPlot = document.getElementById('movieDetailPlot');
  const movieDetailPoster = document.getElementById('movieDetailPoster');
  const movieDetailViewOnIMDb = document.getElementById('movieDetailViewOnIMDb');

  const movieData = DeltaWatch.Watchable({
    searchText: "Star Wars",
    movies: [],
    currentPage: 0,
    selectedMovieData: null
  });

  const {Watcher, Accessor, Mutator} = movieData;

  // Api Calls
  function searchOMDb(page: number) {
    fetch(`//www.omdbapi.com/?apikey=650ad66d&s=${Accessor.searchText}&page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        Mutator.movies = data.Search;
        Mutator.totalResults = data.totalResults;
        Mutator.currentPage = page;
      });
  }

  function getMovie(id: string) {
    fetch(`http://www.omdbapi.com/?apikey=650ad66d&i=${id}`)
      .then((response) => response.json())
      .then((data) => {
        Mutator.selectedMovieData = data;
        movieDetailModalInstance.open();
      });
  }

  function getMaxPages(): number {
    return Math.ceil(Accessor.totalResults / 10);
  }

  //
  // Detail Modal
  //

  DeltaWatch.Watch(Watcher.selectedMovieData, (data: MovieDetails) => {
    if (data === null) {
      return;
    }
    movieDetailTitle.innerHTML = data.Title;
    movieDetailYear.innerHTML = data.Year;
    movieDetailRated.innerHTML = data.Rated;
    movieDetailRuntime.innerHTML = data.Runtime;
    movieDetailDirector.innerHTML = data.Director;
    movieDetailBoxOffice.innerHTML = data.BoxOffice;
    movieDetailPlot.innerHTML = data.Plot;
    movieDetailPoster.setAttribute('src', data.Poster);
    movieDetailViewOnIMDb.setAttribute('href', `http://www.imdb.com/title/${data.imdbID}`);
  });

  closeMovieDetailModalBtn.addEventListener('click', () => {
    Mutator.selectedMovieData = null;
    movieDetailModalInstance.close();
  });

  //
  // Table setup
  //

  // generate rows and create watcher and actions
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
    imdbLink.innerHTML = "View";

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
        // imdbLink.setAttribute('href', `http://www.imdb.com/title/${movieInfo.imdbID}`)
      }
    });

    // Mutation to set current movie as selected and open the detail modal
    imdbLink.addEventListener('click', () => {
      getMovie(Accessor.movies[i].imdbID);
    });
  }

  //
  // Pagination setup
  //
  const pageBtns: { btn: HTMLElement, link: HTMLElement }[] = [];
  for (let i = 0; i < 5; i++) {
    let num = i + 1;
    let pageBtn = document.getElementById(`pageBtn${num}`);
    let pageLink = pageBtn.children[0] as HTMLElement;
    pageBtns.push({
      btn: pageBtn,
      link: pageLink
    });

    let offset = i - 2;

    pageLink.addEventListener('click', () => {
      let newPage = Accessor.currentPage + offset;
      if (newPage > 1 && newPage < getMaxPages()) {
        searchOMDb(newPage);
      }
    });
  }

  // Sets active/inactive state of each page button
  function setPagination() {
    let currentPage = Accessor.currentPage;

    if (currentPage > 3) {
      firstPageLink.innerHTML = `1`;
      firstPageBtn.classList.remove('disabled');
    } else {
      firstPageLink.innerHTML = `...`;
      firstPageBtn.classList.add('disabled');
    }

    // Show one more previous page if its not the first
    if (currentPage > 2) {
      pageBtns[0].link.innerHTML = `${currentPage - 2}`;
      pageBtns[0].btn.classList.remove('disabled');
    } else {
      pageBtns[0].link.innerHTML = `...`;
      pageBtns[0].btn.classList.add('disabled');
    }

    // Set two before it if there are previous pages
    if (currentPage > 1) {
      pageBtns[1].link.innerHTML = `${currentPage - 1}`;
      pageBtns[1].btn.classList.remove('disabled');
      previousPageBtn.classList.remove('disabled');
    } else {
      pageBtns[1].link.innerHTML = `...`;
      pageBtns[1].btn.classList.add('disabled');
      previousPageBtn.classList.add('disabled');
    }

    // Set middle to current page
    let middlePageBtn = pageBtns[2];
    middlePageBtn.link.innerHTML = `${currentPage}`;

    let maxPages: number = getMaxPages();

    // If not on last page, show next page button and number of next page
    if (currentPage < maxPages) {
      pageBtns[3].link.innerHTML = `${currentPage + 1}`;
      pageBtns[3].btn.classList.remove('disabled');
      nextPageBtn.classList.remove('disabled');
    } else {
      pageBtns[3].link.innerHTML = `...`;
      pageBtns[3].btn.classList.add('disabled');
      nextPageBtn.classList.add('disabled');
    }

    // Show one more page button if its not the last one
    if (currentPage < maxPages - 1) {
      pageBtns[4].link.innerHTML = `${currentPage + 2}`;
      pageBtns[4].btn.classList.remove('disabled');
    } else {
      pageBtns[4].link.innerHTML = `...`;
      pageBtns[4].btn.classList.add('disabled');
    }

    // Show last page link if not already in list
    if (Accessor.currentPage < maxPages - 2) {
      lastPageLink.innerHTML = `${maxPages}`;
      lastPageBtn.classList.remove('disabled');
    } else {
      lastPageLink.innerHTML = `...`;
      lastPageBtn.classList.add('disabled');
    }
  }

  // A change to total results or current page will trigger pagination to update
  DeltaWatch.Watch(Watcher.totalResults, (value: number) => {
    totalResultsText.innerHTML = `${value}`;
    setPagination();
  });

  DeltaWatch.Watch(Watcher.currentPage, () => {
    // Show first page link if it isn't already in list
    setPagination();
  });

  // Pagination actions
  previousPageLink.addEventListener('click', () => {
    if (Accessor.currentPage > 1) {
      searchOMDb(Accessor.currentPage - 1);
    }
  });

  nextPageLink.addEventListener('click', () => {
    let maxPages = Math.ceil(Accessor.totalResults / 10);
    if (Accessor.currentPage < maxPages) {
      searchOMDb(Accessor.currentPage + 1);
    }
  });

  firstPageLink.addEventListener('click', () => {
    searchOMDb(1);
  });

  lastPageLink.addEventListener('click', () => {
    let maxPages = Math.ceil(Accessor.totalResults / 10);
    searchOMDb(maxPages);
  });

  //
  // Search Actions
  //
  searchTextInput.addEventListener('input', (event) => {
    let value = (event.target as HTMLInputElement).value;
    Mutator.searchText = value;
    if (value.trim() === "") {
      searchSubmitBtn.setAttribute('disabled', '');
    } else {
      searchSubmitBtn.removeAttribute('disabled');
    }
  });

  searchSubmitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Always get first page on new search
    searchOMDb(1);
  });

  // do initial search
  searchOMDb(1);
});