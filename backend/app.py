from flask import Flask, request, jsonify
from flask_cors import CORS
from recommender import get_similar_movies, get_movies_by_genres

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:5174"])

@app.route('/recommend', methods=['GET'])
def recommend():
    title = request.args.get('title')
    if not title:
        return jsonify({'error': 'Missing title parameter'}), 400

    results = get_similar_movies(title)
    return jsonify({'input': title, 'results': results})

@app.route('/recommend_by_genres', methods=['POST'])
def recommend_by_genres():
    data = request.get_json()
    genres = data.get('genres', [])
    results = get_movies_by_genres(genres)
    return jsonify({'genres': genres, 'results': results})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
