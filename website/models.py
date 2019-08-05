from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Movie(db.Model):
    __tablename__ = 'movies'
    movie_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    images_path = db.Column(db.String(1000), nullable=False)
    imdb_score = db.Column(db.Float, nullable=False)


class Color(db.Model):
	__tablename__ = 'colors'
	color_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	movie = db.Column(db.Integer, db.ForeignKey('movies.movie_id'), nullable=False)
	dominant_color_rgb = db.Column(db.String(64), nullable=False)
	dominant_color_name = db.Column(db.String(64), nullable=False)
	exact_color_name = db.Column(db.String(64), nullable=False)

class Face(db.Model):
  __tablename__ = 'faces'
  face_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  movie = db.Column(db.Integer, db.ForeignKey('movies.movie_id'), nullable=False)
  num_faces = db.Column(db.Integer, nullable=False)

class Actor(db.Model):
  __tablename__ = 'actors'
  face_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  name = db.Column(db.String(64), nullable=False)
  nconst = db.Column(db.String(64), nullable=False)
  face_filename = db.Column(db.String(1000), nullable=False)
  face_encoding = db.Column(nullable=False)