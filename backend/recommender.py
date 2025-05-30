import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load MovieLens 100K movie metadata
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

# Extract genre columns
genre_cols = movies_df.columns[5:]

# Create a genre string per movie
movies_df['genre_str'] = movies_df[genre_cols].apply(
    lambda row: ' '.join([genre for genre, present in zip(genre_cols, row) if present == 1]),
    axis=1
)

# Create a combined content field (title + genres) as proxy tags
movies_df['content'] = movies_df['title'].str.lower() + ' ' + movies_df['genre_str'].str.lower()

# TF-IDF vectorization on the content field
vectorizer = TfidfVectorizer(stop_words='english')
content_matrix = vectorizer.fit_transform(movies_df['content'])

# Compute cosine similarity matrix (once)
similarity = cosine_similarity(content_matrix)

# Movie recommendation function
def get_similar_movies(title, top_n=5):
    try:
        # Match the first movie containing the title string (case-insensitive)
        idx = movies_df[movies_df['title'].str.contains(title, case=False, regex=False)].index[0]
    except IndexError:
        return [{"title": "Movie not found", "score": 0.0}]

    # Get similarity scores and sort
    sim_scores = list(enumerate(similarity[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]

    return [
        {"title": movies_df.iloc[i]["title"], "score": round(score, 2)}
        for i, score in sim_scores
    ]