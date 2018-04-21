import DeltaWatch from 'delta-watch';
import setupMutations from './mutations';
import setupWatches from './watches';
import {RowCount} from "./utils";

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

  const elements: {[key: string]: any} = {
    tableBody,
    searchTextInput,
    searchSubmitBtn,
    previousPageBtn,
    previousPageLink,
    nextPageBtn,
    nextPageLink,
    firstPageBtn,
    firstPageLink,
    lastPageBtn,
    lastPageLink,
    totalResultsText,
    movieDetailModal,
    closeMovieDetailModalBtn,
    movieDetailTitle,
    movieDetailYear,
    movieDetailRated,
    movieDetailRuntime,
    movieDetailDirector,
    movieDetailBoxOffice,
    movieDetailPlot,
    movieDetailPoster,
    movieDetailViewOnIMDb,
  };

  //
  // Table setup
  //

  // generate rows and create watcher and actions
  for (let i = 0; i < RowCount; i++) {
    let rowEle = document.createElement('tr');
    rowEle.classList.add('hide');
    elements[`rowElement${i}`] = rowEle;

    let titleCell = document.createElement('td');
    titleCell.innerHTML = '&mdash;';
    elements[`titleCell${i}`] = titleCell;

    let yearCell = document.createElement('td');
    yearCell.classList.add('center-align');
    yearCell.innerHTML = '&mdash;';
    elements[`yearCell${i}`] = yearCell;

    let imdbCell = document.createElement('td');
    imdbCell.classList.add('center-align');
    elements[`imdbCell${i}`] = imdbCell;

    let imdbLink = document.createElement('a');
    elements[`imdbLink${i}`] = imdbLink;

    imdbLink.classList.add("orange-text", "text-accent-2");
    imdbLink.setAttribute('href', '#');
    imdbLink.innerHTML = "View";

    imdbCell.appendChild(imdbLink);

    rowEle.appendChild(titleCell);
    rowEle.appendChild(yearCell);
    rowEle.appendChild(imdbCell);

    tableBody.appendChild(rowEle);
  }

  //
  // Pagination setup
  //
  for (let i = 0; i < 5; i++) {
    let num = i + 1;
    let pageBtn = document.getElementById(`pageBtn${num}`);
    let pageLink = pageBtn.children[0] as HTMLElement;

    elements[`pageBtn${i}`] = pageBtn;
    elements[`pageLink${i}`] = pageLink;
  }

  setupWatches(elements, Accessor, Watcher);
  setupMutations(elements, Accessor, Mutator);
});