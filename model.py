 from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Movie(db.Model):
    __tablename__ = 'movies'
    movie_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(64), nullable=False)
    director = db.Column(db.String(64), nullable=False)
    critics = db.Column(db.Integer, nullable=False)
    duration = db.Column(db.Float, nullable=False)
    first_actor = db.Column(db.String(64), nullable=False)
    second_actor = db.Column(db.String(64), nullable=False)
    third_actor = db.Column(db.String(64), nullable=False)
    poster_faces = db.Column(db.Integer, nullable=False)
    dominant_color_rgb = db.Column(db.String(64), nullable=False)
    dominant_color_name = db.Column(d.String(64), nullable=False)
    link = db.Column(db.String(64), nullable=False)
    imdb_score = db.Column(db.Float, nullable=False)