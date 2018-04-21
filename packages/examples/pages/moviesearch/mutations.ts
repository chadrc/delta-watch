import {RowCount} from "./utils";
declare const M: any; // Materialize CSS global

export default (elements: { [key: string]: HTMLElement },
                accessor: any,
                mutator: any) => {

  const movieDetailModalInstance = M.Modal.init(elements.movieDetailModal, {}); // Materialize

  // Api Calls
  function searchOMDb(page: number) {
    fetch(`//www.omdbapi.com/?apikey=650ad66d&s=${accessor.searchText}&page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        mutator.movies = data.Search;
        mutator.totalResults = data.totalResults;
        mutator.currentPage = page;
      });
  }

  function getMovie(id: string) {
    fetch(`http://www.omdbapi.com/?apikey=650ad66d&i=${id}`)
      .then((response) => response.json())
      .then((data) => {
        mutator.selectedMovieData = data;
        movieDetailModalInstance.open();
      });
  }

  function getMaxPages(): number {
    return Math.ceil(accessor.totalResults / 10);
  }

  // Mutation to set current movie as selected and open the detail modal
  for (let i=0; i<RowCount; i++) {
    let imdbLink = elements[`imdbLink${i}`];
    imdbLink.addEventListener('click', () => {
      getMovie(accessor.movies[i].imdbID);
    });
  }

  for (let i=0; i<5; i++) {
    let pageLink = elements[`pageLink${i}`];
    let offset = i - 2;

    pageLink.addEventListener('click', () => {
      let newPage = accessor.currentPage + offset;
      if (newPage >= 1 && newPage < getMaxPages()) {
        searchOMDb(newPage);
      }
    });
  }

  elements.closeMovieDetailModalBtn.addEventListener('click', () => {
    mutator.selectedMovieData = null;
    movieDetailModalInstance.close();
  });

  elements.previousPageLink.addEventListener('click', () => {
    if (accessor.currentPage > 1) {
      searchOMDb(accessor.currentPage - 1);
    }
  });

  elements.nextPageLink.addEventListener('click', () => {
    let maxPages = Math.ceil(accessor.totalResults / 10);
    if (accessor.currentPage < maxPages) {
      searchOMDb(accessor.currentPage + 1);
    }
  });

  elements.firstPageLink.addEventListener('click', () => {
    searchOMDb(1);
  });

  elements.lastPageLink.addEventListener('click', () => {
    let maxPages = Math.ceil(accessor.totalResults / 10);
    searchOMDb(maxPages);
  });

  //
  // Search Actions
  //
  elements.searchTextInput.addEventListener('input', (event) => {
    let value = (event.target as HTMLInputElement).value;
    mutator.searchText = value;
    if (value.trim() === "") {
      elements.searchSubmitBtn.setAttribute('disabled', '');
    } else {
      elements.searchSubmitBtn.removeAttribute('disabled');
    }
  });

  elements.searchSubmitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Always get first page on new search
    searchOMDb(1);
  });

  // do initial search
  searchOMDb(1);
}