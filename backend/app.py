from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from recommender import get_similar_movies, get_movies_by_genres, get_movies_by_cluster
import os

# Setup Flask with static folder
app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app, origins=["*"])  # Adjust as needed for deployment

# Serve frontend files correctly
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    # Check if file exists in static root
    file_path_root = os.path.join(app.static_folder, path)
    if path and os.path.exists(file_path_root):
        return send_from_directory(app.static_folder, path)

    # Check if file exists in static/assets (for Vite hashed files)
    file_path_assets = os.path.join(app.static_folder, "assets", path)
    if path and os.path.exists(file_path_assets):
        return send_from_directory(os.path.join(app.static_folder, "assets"), path)

    # Fall back to index.html for SPA routing
    return send_from_directory(app.static_folder, "index.html")

# API endpoints
@app.route("/recommend", methods=["GET"])
def recommend():
    title = request.args.get("title")
    if not title:
        return jsonify({"error": "Missing title parameter"}), 400
    results = get_similar_movies(title)
    return jsonify({"input": title, "results": results})

@app.route("/recommend_by_genres", methods=["POST"])
def recommend_by_genres():
    data = request.get_json()
    genres = data.get("genres", [])
    min_score = float(data.get("min_score", 0.0))
    min_year = int(data.get("min_year", 1900))
    max_year = int(data.get("max_year", 2025))
    results = get_movies_by_genres(
        genres=genres,
        top_n=10,
        min_score=min_score,
        min_year=min_year,
        max_year=max_year,
    )
    return jsonify({"genres": genres, "results": results})

@app.route("/recommend_by_cluster", methods=["GET"])
def recommend_by_cluster():
    try:
        cluster = int(request.args.get("cluster"))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid or missing cluster parameter"}), 400
    results = get_movies_by_cluster(cluster)
    return jsonify({"cluster": cluster, "results": results})

# Dev entry point
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
