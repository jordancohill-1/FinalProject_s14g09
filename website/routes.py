from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from werkzeug.utils import secure_filename
import upload
from models import db, Movie, Color
from sqlalchemy import create_engine;
#from forms import UsersForm

UPLOAD_FOLDER = 'UPLOAD_FOLDER'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)

#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/usersdb'
#db.init_app(app)
db_string = "postgres://s14g09:s14g09_Master@movie.cdnh3cwt5np2.us-east-1.rds.amazonaws.com:5432/s14g09_IMDB_ColorPrediction"

db = create_engine(db_string)
print(" Database has the following tables: ", db.table_names())


movies_table = db.execute('SELECT * FROM movies')
colors_table = db.execute('SELECT * FROM colors')
faces_table = db.execute('SELECT * FROM faces')
#for row in movies_table:
#	print("movie id:", row['movie_id'], "path:", row['images_path'], "score:", row['imdb_score'])
#for row in colors_table:
#	print("color id:", row['color_id'], "movie:", row['movie'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


app.secret_key = "e14a-key"

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
    movies_json = {'movie': []}
    movies = Movie.query.all()
    #print(movies)
    #for movie in movies_table:
    #    movie_info = movie.__dict__
    #    del movie_info['_sa_instance_state']
    #    movies_json['movie'].append(movie_info)
    return jsonify(movies_json)

if __name__ == "__main__":
  app.run(debug=True)