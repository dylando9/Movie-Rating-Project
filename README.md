# Movie-Rating-Data-Science-Project

# Interactive Movie Recommendation System

This project is an interactive movie recommendation engine that works even for new users and new movies. It uses a **content-based approach** powered by the MovieLens dataset and enriched with metadata from **TMDb (The Movie Database)** API.

## Features

- Recommend similar movies based on a given input movie
- Support for new users entering their preferences
- Handles **cold-start** scenarios (new movies or users)
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

