// Subsets of the data returned from the OMDb API
export interface MovieInfo {
  Title: string
  Year: string
  imdbID: string
}

export interface MovieDetails {
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
export const RowCount = 10;