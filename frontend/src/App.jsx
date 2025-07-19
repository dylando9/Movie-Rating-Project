import { useState, useEffect } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE;

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

const clusterLabels = {
  0: "🎭 Classic Comedies & Musicals",
  1: "🚀 Sci-Fi & Fantasy Adventures",
  2: "🔪 Thrillers & Crime Dramas",
  3: "🎬 Romantic Dramas & Tearjerkers",
  4: "👻 Horror & Mystery",
  5: "🎞️ Documentaries & Film-Noir",
};

function App() {
  const [inputTitle, setInputTitle] = useState("");
  const [results, setResults] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [minYear, setMinYear] = useState(1900);
  const [maxYear, setMaxYear] = useState(new Date().getFullYear());
  const [selectedCluster, setSelectedCluster] = useState("");

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#121212" : "#ffffff";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleTitleSearch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/recommend`, {
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
      const res = await axios.post(`${BASE_URL}/recommend_by_genres`, {
        genres: selectedGenres,
        min_year: minYear,
        max_year: maxYear,
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

  const handleClusterRecommend = async () => {
    if (selectedCluster === "") return;
    try {
      const res = await axios.get(`${BASE_URL}/recommend_by_cluster`, {
        params: { cluster: selectedCluster },
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
      <p style={{ fontStyle: "italic", marginBottom: "1rem" }}>
        Get movie recommendations by typing a title, selecting genres, or
        choosing a cluster. Powered by TMDb and MovieLens data.
      </p>

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
        <h2>Or Choose a Cluster:</h2>
        <select
          value={selectedCluster}
          onChange={(e) => setSelectedCluster(e.target.value)}
          style={{ ...styles.input, width: "200px" }}
        >
          <option value="">Select Cluster</option>
          {Object.entries(clusterLabels).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        <button onClick={handleClusterRecommend} style={styles.button}>
          Recommend by Cluster
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
              {movie.cluster_label && (
                <p style={{ fontSize: "0.8rem", fontStyle: "italic" }}>
                  {movie.cluster_label}
                </p>
              )}
            </div>
          ))}
          <div
            style={{
              marginTop: "3rem",
              fontSize: "0.9rem",
              color: darkMode ? "#aaa" : "#555",
            }}
          >
            <hr style={{ marginBottom: "1rem" }} />

            <h3>About This Project</h3>
            <p>
              This app was built using React (Vite), Flask, and ML techniques
              like TF-IDF and KMeans to recommend movies by title, genre, and
              cluster.
            </p>
            <p>
              🎞️ Movie data:{" "}
              <a
                href="https://grouplens.org/datasets/movielens/"
                target="_blank"
                rel="noreferrer"
              >
                MovieLens 100K
              </a>
              <br />
              🎨 Poster images & ratings:{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noreferrer"
              >
                TMDb API
              </a>{" "}
              (not endorsed or certified by TMDb)
            </p>
            <p>
              Built by <strong>Dylan Do</strong> •{" "}
              <a
                href="https://github.com/dylando9/Movie-Rating-Project"
                target="_blank"
                rel="noreferrer"
              >
                GitHub Repo
              </a>
            </p>

            <p style={{ marginTop: "1rem" }}>
              © {new Date().getFullYear()} Movie Recommender
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
