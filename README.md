# 🎬 Movie-Rating-Recommender-App

## Interactive Movie Recommendation System

This is an interactive, user-friendly movie recommendation web application. It allows users to search for movies they like and get personalized recommendations using **content-based filtering** powered by the MovieLens 100k dataset and enhanced with TMDb metadata.

---

## ✨ Features

- 🔍 Recommend similar movies based on a user-input movie title
- 🧠 Cold-start onboarding via selectable **genres** for new users
- 🧩 Uses **TF-IDF vectorization** for content similarity across titles and genres
- 🖼️ Automatically fetches **poster images** using the [TMDb API](https://www.themoviedb.org/)
- 🌙 Toggle between **dark mode** and light mode
- 🔗 Movie posters are **clickable**, linking to the movie's TMDb search result

---

## 📦 Dataset(s)

- **MovieLens 100k**: [Download here](https://grouplens.org/datasets/movielens/100k/)
- **TMDb Metadata** *(Optional)*: Requires a free API key via [TMDb signup](https://www.themoviedb.org/)

---

## 🛠️ Tools + Libraries

### Backend (Python)

- `pandas`, `scikit-learn` — TF-IDF + cosine similarity
- `Flask` — API server
- `requests` — TMDb API integration

### Frontend (React + Vite)

- `axios` — HTTP client for API communication
- `.env` — secure API key handling
- REST API — poster search from TMDb

---

## How It Works

1. **Title Input**: Type a movie name → backend returns most similar titles
2. **Genre Selection**: Pick one or more genres → backend returns top matches
3. **Poster Retrieval**: Frontend fetches poster images from TMDb API
4. **Dark Mode Toggle**: Frontend button switches theme (light ↔ dark)
5. **Clickable Posters**: Clicking a poster opens TMDb search for the movie

---

## Citations

> F. Maxwell Harper and Joseph A. Konstan. 2015. The MovieLens Datasets: History and Context.
> ACM Transactions on Interactive Intelligent Systems (TIIS) 5, 4, Article 19 (December 2015), 19 pages.
> DOI: [https://doi.org/10.1145/2827872](https://doi.org/10.1145/2827872)

---

## Local Development

```bash
# Backend Setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
