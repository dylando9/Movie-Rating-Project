# 🎬 Movie Recommender App

A smart, interactive web app for movie recommendations using **content-based filtering**, **clustering**, and genre-based search. Built with Flask (backend) and React (frontend), it integrates TMDb for posters and MovieLens for ratings and metadata.

---

## Live Demo

[🔗 Link to Website here](https://smart-movie-search.fly.dev/)


---

## Features

- 🔍 Recommend similar movies based on a user-input title
- 🎯 Filter by **genre** and **release year range**
- 🧩 Choose movie clusters like:
  - 🎭 *Classic Comedies & Musicals*
  - 🚀 *Sci-Fi & Fantasy Adventures*
  - 🔪 *Thrillers & Crime Dramas*
- 🖼️ Fetch poster images and ratings from TMDb
- 🌓 Toggle between dark mode and light mode
- 🎞️ Posters are clickable → open in TMDb for more info
- 📅 Input year range for filtered recommendations

---

## Recommendation Engine

- **KMeans Clustering** to group movies by content and theme
- **Cold-start genre selection** for new users without history

---

## Tech Stack

### Backend (Flask + Python)
- `pandas`, `scikit-learn`, `Flask`, `requests`

### Frontend (React + Vite)
- `React`, `axios`
- Environment-based API key handling via `.env`
- Responsive styling with CSS and inline dark mode logic

---

## Datasets & APIs

- 🎞️ **[MovieLens 100K](https://grouplens.org/datasets/movielens/100k/)** — User ratings, genres, movie titles
- 🖼️ **[TMDb API](https://www.themoviedb.org/)** — Poster images, metadata (requires free API key)

---

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/dylando9/Movie-Rating-Project.git
cd Movie-Rating-Project

# 2. Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py

# 3. Frontend setup
cd ../frontend
npm install
npm run dev
