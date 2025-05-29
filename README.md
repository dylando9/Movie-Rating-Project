# Movie-Rating-Data-Science-Project

# Interactive Movie Recommendation System

This project is an interactive, cold-start-friendly movie recommendation engine. It uses a **content-based filtering** approach based on the MovieLens dataset and TMDb metadata.

## Features

- Recommend similar movies based on a given input movie
- Support for new users entering their preferences
- Uses **content-based filtering** with genres, descriptions, and keywords
- Optionally enriched with TMDb metadata (e.g., overviews, cast, keywords)

---

## Dataset(s)

- **MovieLens 100k**
  Download from: [https://grouplens.org/datasets/movielens/100k/](https://grouplens.org/datasets/movielens/100k/)

- **TMDb Metadata (optional)**
  Get a free API key by signing up at [TMDb](https://www.themoviedb.org/documentation/api)

---

## 🛠️ Tools Needed

- Python
- `pandas`, `scikit-learn` – data processing + similarity calculation
- `tmdbsimple` – access to TMDb API

---

## Citations

- F. Maxwell Harper and Joseph A. Konstan. 2015. The MovieLens Datasets:
History and Context. ACM Transactions on Interactive Intelligent
Systems (TiiS) 5, 4, Article 19 (December 2015), 19 pages.
DOI=http://dx.doi.org/10.1145/2827872
