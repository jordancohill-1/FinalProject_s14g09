from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, session
from werkzeug.utils import secure_filename
from models import db, Movie, Color, Face
from sqlalchemy import create_engine;
import os, random
import pandas as pd

app = Flask(__name__)
app.secret_key ="s14g09_IMDB_ColorPrediction"

app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://s14g09:s14g09_Master@movie.cdnh3cwt5np2.us-east-1.rds.amazonaws.com:5432/s14g09_IMDB_ColorPrediction"
app.config['UPLOAD_FOLDER'] = 'UPLOAD_FOLDER'
app.config['ALLOWED_EXTENSIONS'] = ['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif']
db.init_app(app)

def dataset():
	return  pd.read_sql(db.session.query(Movie, Color).join(Color).statement, db.session.bind)

@app.route("/")
def index():
  return render_template("index.html")

@app.route("/about")
def about():
  return render_template("about.html")

@app.route("/trends")
def trends():
	images=[]
	path="static/images/randoms"
	for i in range(0,3):
		randFile = random.choice([x for x in os.listdir(path)
	    	if os.path.isfile(os.path.join(path, x))])
		images.append(randFile)
	imgOne =  path + "/" +images[0]
	imgTwo =  path + "/" +images[1]
	imgThree =  path + "/" +images[2]
	print(imgOne)
	return render_template("trends.html", imgOne=imgOne, imgTwo=imgTwo, imgThree=imgThree)

def allowed_file(filename):
	if not '.' in filename :
		return False
	ext = filename.rsplit('.', 1)[1]

	if ext.upper() in app.config['ALLOWED_EXTENSIONS']:
		return True
	else:
		return False


@app.route("/upload", methods = ['GET', 'POST'])
def upload():
	if request.method == "POST":
		if request.files:
			#processUpload.clearDir()

			image = request.files["image"]

			if image.filename == " ":
				return redirect(request.url)
			if allowed_file(image.filename):
				return redirect(request.url)
			else:
				filename = secure_filename(image.filename)
				image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
				results = processUpload.process(filename)
				session.clear()
				session['results'] = results
			return redirect(url_for('results'))
	return render_template("upload.html")

@app.route("/results")
def results():
	if session.get('results'):
		return render_template("results.html", results=session['results'])
	else:
		return render_template("results.html")

@app.route('/load_data', methods=['GET'])
def load_data():
	movies_json = {'movies': []}
	movies = db.session.query(Movie, Color).join(Color).all()
	#colors = db.session.query(Color).join(Movie).all()
	#print(movies)
	for movie in movies:
		#print(movie.index)
		movie_info = movie.__dict__
		del movie_info['_sa_instance_state']
		movies_json['movies'].append(movie_info)
	#print(movies_json)
	return jsonify(movies_json)

@app.route('/load_color_data', methods=['GET'])
def load_color_data():
	colors_json = {'colors': []}
	colors = db.session.query(Color).join(Movie).all()
	for color in colors:
		color_info = color.__dict__
		del color_info['_sa_instance_state']
		colors_json['colors'].append(color_info)
	return jsonify(colors_json)

@app.route('/load_movie_data', methods=['GET'])
def load_movie_data():
	movies_json = {'movies': []}
	movies = db.session.query(Movie).join(Color).all()
	for movie in movies:
		movie_info = movie.__dict__
		del movie_info['_sa_instance_state']
		movies_json['movies'].append(movie_info)
	return jsonify(movies_json)

@app.route('/load_face_data', methods=['GET'])
def load_face_data():
	faces_json = {'faces': []}
	faces = db.session.query(Face).join(Movie).all()
	for face in faces:
		face_info = face.__dict__
		del face_info['_sa_instance_state']
		faces_json['faces'].append(face_info)
	return jsonify(faces_json)

if __name__ == "__main__":
  app.run(debug=True)
  
import processUpload
import trainTest