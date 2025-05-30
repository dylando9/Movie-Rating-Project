import { useState, useEffect } from "react";
import axios from "axios";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

async function fetchPosterAndDetails(title) {
  try {
    const cleanedTitle = title.replace(/\s*\(\d{4}\)/, "");
    const response = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          api_key: TMDB_API_KEY,
          query: cleanedTitle,
        },
      }
    );

    const result = response.data.results[0];
    if (result) {
      return {
        poster: result.poster_path
          ? `https://image.tmdb.org/t/p/w200${result.poster_path}`
          : null,
        rating: result.vote_average,
        year: result.release_date
          ? new Date(result.release_date).getFullYear()
          : null,
      };
    }
  } catch (err) {
    console.error("TMDb error:", err);
  }
  return { poster: null, rating: null, year: null };
}

const availableGenres = [
  "Action",
  "Adventure",
  "Animation",
  "Children's",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Film-Noir",
  "Horror",
  "Musical",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western",
];

function App() {
  const [inputTitle, setInputTitle] = useState("");
  const [results, setResults] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [minYear, setMinYear] = useState(1900);
  const [maxYear, setMaxYear] = useState(new Date().getFullYear());

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#121212" : "#ffffff";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleTitleSearch = async () => {
    try {
      const res = await axios.get("http://localhost:5000/recommend", {
        params: { title: inputTitle },
      });

      const enriched = await Promise.all(
        res.data.results.map(async (movie) => {
          const details = await fetchPosterAndDetails(movie.title);
          return { ...movie, ...details };
        })
      );

      setResults(enriched);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleGenreRecommend = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/recommend_by_genres",
        {
          genres: selectedGenres,
        }
      );

      const enriched = await Promise.all(
        res.data.results.map(async (movie) => {
          const details = await fetchPosterAndDetails(movie.title);
          return { ...movie, ...details };
        })
      );

      const filtered = enriched.filter(
        (movie) =>
          !movie.year || (movie.year >= minYear && movie.year <= maxYear)
      );

      setResults(filtered);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const styles = {
    container: {
      padding: "2rem",
      fontFamily: "Arial",
      color: darkMode ? "#e0e0e0" : "#111",
      backgroundColor: darkMode ? "#121212" : "#fff",
      minHeight: "100vh",
    },
    input: {
      padding: "0.5rem",
      marginRight: "1rem",
      background: darkMode ? "#333" : "#fff",
      color: darkMode ? "#e0e0e0" : "#000",
      border: "1px solid #ccc",
    },
    button: {
      padding: "0.5rem 1rem",
      marginTop: "1rem",
      cursor: "pointer",
      backgroundColor: darkMode ? "#444" : "#f0f0f0",
      color: darkMode ? "#fff" : "#000",
      border: "1px solid #888",
    },
    movieCard: {
      width: "200px",
      textAlign: "center",
      background: darkMode ? "#1e1e1e" : "#f9f9f9",
      borderRadius: "8px",
      padding: "0.5rem",
    },
  };

  return (
    <div style={styles.container}>
      <h1>🎬 Movie Recommender</h1>

      <button onClick={toggleTheme} style={styles.button}>
        Toggle {darkMode ? "Light" : "Dark"} Mode
      </button>

      <div style={{ marginTop: "1rem" }}>
        <input
          type="text"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          placeholder="Enter a movie title"
          style={styles.input}
        />
        <button onClick={handleTitleSearch} style={styles.button}>
          Recommend by Title
        </button>
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
        <div style={{ marginTop: "1rem" }}>
          <label>
            📅 Year Range: {minYear} - {maxYear}
          </label>
          <div>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={minYear}
              onChange={(e) => setMinYear(Number(e.target.value))}
              style={{ width: "80px", marginRight: "1rem" }}
            />
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={maxYear}
              onChange={(e) => setMaxYear(Number(e.target.value))}
              style={{ width: "80px" }}
            />
          </div>
        </div>
        <button onClick={handleGenreRecommend} style={styles.button}>
          Recommend by Genre
        </button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>Results:</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {results.map((movie, i) => (
            <div key={i} style={styles.movieCard}>
              {movie.poster ? (
                <a
                  href={`https://www.themoviedb.org/search?query=${encodeURIComponent(
                    movie.title.replace(/\s*\(\d{4}\)/, "")
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={{ width: "100%", borderRadius: "4px" }}
                  />
                </a>
              ) : (
                <div style={{ height: "300px", background: "#888" }}>
                  No Image
                </div>
              )}
              <p>
                {movie.title}
                {!movie.title.includes(`(${movie.year})`) && movie.year
                  ? ` (${movie.year})`
                  : ""}
              </p>
              {movie.rating && (
                <p style={{ fontSize: "0.9rem", color: "gold" }}>
                  ⭐ {movie.rating.toFixed(1)} / 10
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
