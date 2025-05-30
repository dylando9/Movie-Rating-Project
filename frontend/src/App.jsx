import { useState } from "react";
import axios from "axios";

// Load TMDb API key from .env
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Fetch poster image and TMDb link from TMDb
async function fetchPosterAndLink(title) {
  try {
    const cleanedTitle = title.replace(/\s*\(\d{4}\)/, ""); // Remove year
    const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
      params: {
        api_key: TMDB_API_KEY,
        query: cleanedTitle,
      },
    });

    const results = response.data.results;
    if (results.length > 0) {
      const movie = results[0];
      return {
        poster: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : null,
        url: `https://www.themoviedb.org/movie/${movie.id}`,
      };
    }
  } catch (err) {
    console.error("TMDb error:", err);
  }
  return { poster: null, url: null };
}

const availableGenres = [
  "Action", "Adventure", "Animation", "Children's", "Comedy", "Crime",
  "Documentary", "Drama", "Fantasy", "Film-Noir", "Horror", "Musical",
  "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western"
];

function App() {
  const [inputTitle, setInputTitle] = useState("");
  const [results, setResults] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleTitleSearch = async () => {
    try {
      const res = await axios.get("http://localhost:5000/recommend", {
        params: { title: inputTitle },
      });

      const enriched = await Promise.all(
        res.data.results.map(async (movie) => {
          const { poster, url } = await fetchPosterAndLink(movie.title);
          return { ...movie, poster, url };
        })
      );

      setResults(enriched);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleGenreRecommend = async () => {
    try {
      const res = await axios.post("http://localhost:5000/recommend_by_genres", {
        genres: selectedGenres,
      });

      const enriched = await Promise.all(
        res.data.results.map(async (movie) => {
          const { poster, url } = await fetchPosterAndLink(movie.title);
          return { ...movie, poster, url };
        })
      );

      setResults(enriched);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🎬 Movie Recommender</h1>

      <div>
        <input
          type="text"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          placeholder="Enter a movie title"
        />
        <button onClick={handleTitleSearch}>Recommend by Title</button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>Or Select Genres:</h2>
        {availableGenres.map((genre) => (
          <label key={genre} style={{ marginRight: "1rem" }}>
            <input
              type="checkbox"
              checked={selectedGenres.includes(genre)}
              onChange={() => toggleGenre(genre)}
            />
            {genre}
          </label>
        ))}
        <br />
        <button onClick={handleGenreRecommend} style={{ marginTop: "1rem" }}>
          Recommend by Genre
        </button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>Results:</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {results.map((movie, i) => (
            <div key={i} style={{ width: "200px", textAlign: "center" }}>
              {movie.poster ? (
                <a href={movie.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={{ width: "100%", borderRadius: "5px" }}
                  />
                </a>
              ) : (
                <div style={{ height: "300px", background: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  No Image
                </div>
              )}
              <p>{movie.title}</p>
              <p style={{ fontSize: "0.9rem", color: "gray" }}>
                {(movie.score * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
