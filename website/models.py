from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Movie(db.Model):
    __tablename__ = 'movies'
    movie_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    images_path = db.Column(db.String(64), nullable=False)
    imdb_score = db.Column(db.Float, nullable=False)


class Color(db.Model):
    __tablename__ = 'colors'
    color_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    movie = db.Column(db.Integer, db.ForeignKey('movies.movie_id'), nullable=False)
    imdb_score = db.Column(db.Float, nullable=False)
    