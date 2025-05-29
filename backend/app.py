from flask import Flask, request, jsonify
from flask_cors import CORS
from recommender import get_similar_movies

app = Flask(__name__)
CORS(app)  # Enable CORS so React can access this API

@app.route('/recommend', methods=['GET'])
def recommend():
    title = request.args.get('title')
    if not title:
        return jsonify({'error': 'Missing title parameter'}), 400

    results = get_similar_movies(title)
    return jsonify({'input': title, 'results': results})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
