import { useState } from 'react';
import axios from 'axios';

function App() {
  const [inputTitle, setInputTitle] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async () => {
    try {
      const res = await axios.get('http://localhost:5000/recommend', {
        params: { title: inputTitle }
      });
      setResults(res.data.results);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🎬 Movie Recommender</h1>
      <input
        type="text"
        value={inputTitle}
        onChange={(e) => setInputTitle(e.target.value)}
        placeholder="Enter a movie title"
      />
      <button onClick={handleSubmit}>Recommend</button>

      <ul>
        {results.map((movie, i) => (
          <li key={i}>{movie.title} ({(movie.score * 100).toFixed(1)}%)</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
