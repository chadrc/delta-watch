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
  const previousPageBtn = document.getElementById('previousPageBtn');
  const previousPageLink = previousPageBtn.children[0];
  const nextPageBtn = document.getElementById('nextPageBtn');
  const nextPageLink = nextPageBtn.children[0];
  const firstPageBtn = document.getElementById('firstPageBtn');
  const firstPageLink = firstPageBtn.children[0];
  const lastPageBtn = document.getElementById('lastPageBtn');
  const lastPageLink = lastPageBtn.children[0];
  const totalResultsText = document.getElementById('totalResultsText');

  const movieData = DeltaWatch.Watchable({
    searchText: "Star Wars",
    movies: [],
    currentPage: 0
  });

  const {Watcher, Accessor, Mutator} = movieData;

  // Api Call
  function searchOMDb(page: number) {
    fetch(`//www.omdbapi.com/?apikey=650ad66d&s=${Accessor.searchText}&page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        Mutator.movies = data.Search;
        Mutator.totalResults = data.totalResults;
        Mutator.currentPage = page;
      });
  }

  function getMaxPages(): number {
    return Math.ceil(Accessor.totalResults / 10);
  }

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
        imdbLink.setAttribute('href', `http://www.imdb.com/title/${movieInfo.imdbID}`)
      }
    });
  }

  const pageBtns: {btn: HTMLElement, link: HTMLElement}[] = [];
  for (let i=0; i<5; i++) {
    let num = i+1;
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

  DeltaWatch.Watch(Watcher.totalResults, (value: number) => {
    totalResultsText.innerHTML = `${value}`;
    setPagination();
  });

  DeltaWatch.Watch(Watcher.currentPage, () => {
    // Show first page link if it isn't already in list
    setPagination();
  });

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

    // Always get first page on new search
    searchOMDb(1);
  });

  // do initial search
  searchOMDb(1);
});