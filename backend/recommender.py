import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
import requests
import os

# Load MovieLens movie data
movies_df = pd.read_csv(
    './Datasets/ml-100k/u.item',
    sep='|',
    encoding='latin-1',
    header=None,
    names=[
        'movie_id', 'title', 'release_date', 'video_release_date', 'IMDb_URL',
        'unknown', 'Action', 'Adventure', 'Animation', "Children's", 'Comedy',
        'Crime', 'Documentary', 'Drama', 'Fantasy', 'Film-Noir', 'Horror',
        'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
    ]
)

genre_cols = movies_df.columns[5:]
movies_df['year'] = movies_df['title'].str.extract(r'\((\d{4})\)').fillna(0).astype(int)

# Create overview (simulate)
movies_df['overview'] = movies_df[genre_cols].apply(
    lambda row: ' '.join([genre for genre, present in zip(genre_cols, row) if present == 1]),
    axis=1
)

movies_df['genre_str'] = movies_df[genre_cols].apply(
    lambda row: ' '.join([genre for genre, val in zip(genre_cols, row) if val == 1]),
    axis=1
)
movies_df['content'] = (
    movies_df['title'].str.lower() + ' ' +
    movies_df['genre_str'].str.lower() + ' ' +
    movies_df['overview'].str.lower()
)

# TF-IDF + clustering
vectorizer = TfidfVectorizer(stop_words='english')
content_matrix = vectorizer.fit_transform(movies_df['content'])
similarity = cosine_similarity(content_matrix)

kmeans = KMeans(n_clusters=6, random_state=42, n_init=10)
movies_df['cluster'] = kmeans.fit_predict(content_matrix)

cluster_labels = {
    0: "🎭 Classic Comedies & Musicals",
    1: "🚀 Sci-Fi & Fantasy Adventures",
    2: "🔪 Thrillers & Crime Dramas",
    3: "🎬 Romantic Dramas & Tearjerkers",
    4: "👻 Horror & Mystery",
    5: "🎞️ Documentaries & Film-Noir"
}

# TMDB API
TMDB_API_KEY = os.getenv("VITE_TMDB_API_KEY")

def fetch_tmdb_data(title):
    cleaned = title.replace("(", "").replace(")", "")
    url = "https://api.themoviedb.org/3/search/movie"
    params = {"api_key": TMDB_API_KEY, "query": cleaned}
    try:
        res = requests.get(url, params=params)
        data = res.json()
        if data["results"]:
            poster_path = data["results"][0].get("poster_path")
            tmdb_id = data["results"][0].get("id")
            poster_url = f"https://image.tmdb.org/t/p/w200{poster_path}" if poster_path else None
            return poster_url, tmdb_id
    except Exception:
        pass
    return None, None

# ----- Recommendation Functions ----- #

def get_similar_movies(title, top_n=5):
    try:
        idx = movies_df[movies_df['title'].str.contains(title, case=False, regex=False)].index[0]
    except IndexError:
        return [{"title": "Movie not found", "score": 0.0, "poster": None, "tmdb_id": ""}]

    sim_scores = list(enumerate(similarity[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]

    results = []
    for i, score in sim_scores:
        row = movies_df.iloc[i]
        poster, tmdb_id = fetch_tmdb_data(row["title"])
        results.append({
            "title": row["title"],
            "score": round(score, 2),
            "poster": poster,
            "tmdb_id": tmdb_id
        })
    return results

def get_movies_by_genres(genres, top_n=10, min_score=0.0, min_year=1900, max_year=2025):
    if not genres:
        return []

    mask = movies_df[genres].any(axis=1)
    filtered = movies_df[mask]
    filtered = filtered[(filtered['year'] >= min_year) & (filtered['year'] <= max_year)]

    if filtered.empty:
        return []

    top_movies = filtered.sample(n=min(top_n, len(filtered)), random_state=42)

    results = []
    for _, row in top_movies.iterrows():
        poster, tmdb_id = fetch_tmdb_data(row["title"])
        results.append({
            "title": row["title"],
            "score": 1.0,
            "poster": poster,
            "tmdb_id": tmdb_id
        })

    return [r for r in results if r['score'] >= min_score]

def get_movies_by_cluster(cluster_id, top_n=10):
    cluster_movies = movies_df[movies_df['cluster'] == cluster_id]
    if cluster_movies.empty:
        return []

    top_movies = cluster_movies.sample(n=min(top_n, len(cluster_movies)), random_state=42)

    results = []
    for _, row in top_movies.iterrows():
        poster, tmdb_id = fetch_tmdb_data(row["title"])
        results.append({
            "title": row["title"],
            "score": 1.0,
            "poster": poster,
            "tmdb_id": tmdb_id,
            "cluster_label": cluster_labels.get(cluster_id, f"Cluster {cluster_id}")
        })

    return results