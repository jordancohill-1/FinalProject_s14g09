from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from werkzeug.utils import secure_filename
import upload
from models import db, Movie, Color
from sqlalchemy import create_engine;


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://s14g09:s14g09_Master@movie.cdnh3cwt5np2.us-east-1.rds.amazonaws.com:5432/s14g09_IMDB_ColorPrediction"
db.init_app(app)

@app.route("/")
def index():
  return render_template("index.html")

@app.route("/trends")
def trends():
  return render_template("trends.html")

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/upload", methods = ['GET', 'POST'])
def upload():
	if request.method == 'POST':
		if 'file' not in request.files:
			flash('No file part')
			return redirect(request.url)
		file = request.files['file']
		if file.filename == '':
			flash('No selected file')
			return redirect(request.url)
		if file and allowed_file(file.filename):
			filename = secure_filename(file.filename)
			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
			upload.quant(file)
			return redirect(url_for('upload', filename=filename))
		else:
  			return render_template("upload.html")

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

if __name__ == "__main__":
  app.run(debug=True)