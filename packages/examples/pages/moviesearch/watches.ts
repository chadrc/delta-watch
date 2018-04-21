import DeltaWatch from "delta-watch";
import {MovieDetails, MovieInfo, RowCount} from "./utils";

export default (elements: { [key: string]: HTMLElement },
                accessor: any,
                watcher: any) => {

  function getMaxPages(): number {
    return Math.ceil(accessor.totalResults / 10);
  }

  // Sets active/inactive state of each page button
  function setPagination() {
    let currentPage = accessor.currentPage;

    if (currentPage > 3) {
      elements.firstPageLink.innerHTML = `1`;
      elements.firstPageBtn.classList.remove('disabled');
    } else {
      elements.firstPageLink.innerHTML = `...`;
      elements.firstPageBtn.classList.add('disabled');
    }

    // Show one more previous page if its not the first
    if (currentPage > 2) {
      elements[`pageLink0`].innerHTML = `${currentPage - 2}`;
      elements[`pageBtn0`].classList.remove('disabled');
    } else {
      elements[`pageLink0`].innerHTML = `...`;
      elements[`pageBtn0`].classList.add('disabled');
    }

    // Set two before it if there are previous pages
    if (currentPage > 1) {
      elements[`pageLink1`].innerHTML = `${currentPage - 1}`;
      elements[`pageBtn1`].classList.remove('disabled');
      elements.previousPageBtn.classList.remove('disabled');
    } else {
      elements[`pageLink1`].innerHTML = `...`;
      elements[`pageBtn1`].classList.add('disabled');
      elements.previousPageBtn.classList.add('disabled');
    }

    // Set middle to current page
    let middlePageBtn = elements[`pageLink2`];
    middlePageBtn.innerHTML = `${currentPage}`;

    let maxPages: number = getMaxPages();

    // If not on last page, show next page button and number of next page
    if (currentPage < maxPages) {
      elements[`pageLink3`].innerHTML = `${currentPage + 1}`;
      elements[`pageBtn3`].classList.remove('disabled');
      elements.nextPageBtn.classList.remove('disabled');
    } else {
      elements[`pageLink3`].innerHTML = `...`;
      elements[`pageBtn3`].classList.add('disabled');
      elements.nextPageBtn.classList.add('disabled');
    }

    // Show one more page button if its not the last one
    if (currentPage < maxPages - 1) {
      elements[`pageLink4`].innerHTML = `${currentPage + 2}`;
      elements[`pageBtn4`].classList.remove('disabled');
    } else {
      elements[`pageLink4`].innerHTML = `...`;
      elements[`pageBtn4`].classList.add('disabled');
    }

    // Show last page link if not already in list
    if (accessor.currentPage < maxPages - 2) {
      elements.lastPageLink.innerHTML = `${maxPages}`;
      elements.lastPageBtn.classList.remove('disabled');
    } else {
      elements.lastPageLink.innerHTML = `...`;
      elements.lastPageBtn.classList.add('disabled');
    }
  }

  for (let i=0; i<RowCount; i++) {
    let rowEle = elements[`rowElement${i}`];
    let titleCell = elements[`titleCell${i}`];
    let yearCell = elements[`yearCell${i}`];

    // Single watcher per row matching its corresponding slot in movies array
    DeltaWatch.Watch(watcher.movies[i], (movieInfo: MovieInfo) => {
      if (!movieInfo) {
        rowEle.classList.add('hide');
      } else {
        rowEle.classList.remove('hide');

        titleCell.innerHTML = movieInfo.Title;
        yearCell.innerHTML = movieInfo.Year;
      }
    });
  }

  // A change to total results or current page will trigger pagination to update
  DeltaWatch.Watch(watcher.totalResults, (value: number) => {
    elements.totalResultsText.innerHTML = `${value}`;
    setPagination();
  });

  DeltaWatch.Watch(watcher.currentPage, () => {
    // Show first page link if it isn't already in list
    setPagination();
  });

  DeltaWatch.Watch(watcher.selectedMovieData, (data: MovieDetails) => {
    if (data === null) {
      return;
    }
    elements.movieDetailTitle.innerHTML = data.Title;
    elements.movieDetailYear.innerHTML = data.Year;
    elements.movieDetailRated.innerHTML = data.Rated;
    elements.movieDetailRuntime.innerHTML = data.Runtime;
    elements.movieDetailDirector.innerHTML = data.Director;
    elements.movieDetailBoxOffice.innerHTML = data.BoxOffice;
    elements.movieDetailPlot.innerHTML = data.Plot;
    elements.movieDetailPoster.setAttribute('src', data.Poster);
    elements.movieDetailViewOnIMDb.setAttribute('href', `http://www.imdb.com/title/${data.imdbID}`);
  });
}