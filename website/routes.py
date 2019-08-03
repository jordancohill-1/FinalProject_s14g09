# Database handling: https://towardsdatascience.com/sqlalchemy-python-tutorial-79a577141a91
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from werkzeug.utils import secure_filename
import upload
<<<<<<< HEAD
from models import db, Movie #, Color
from sqlalchemy import create_engine;
=======
from models import db, Movie, Color
import sqlalchemy as db
from sqlalchemy import create_engine
from sqlalchemy import Table, Column, String, MetaData
import pandas as pd
#from forms import UsersForm
>>>>>>> ce078ef44e396c917b095f91f065aafd23990cbe


app = Flask(__name__)

<<<<<<< HEAD
app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://s14g09:s14g09_Master@movie.cdnh3cwt5np2.us-east-1.rds.amazonaws.com:5432/s14g09_IMDB_ColorPrediction"
db.init_app(app)
=======
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/usersdb'
#db.init_app(app)
db_string = "postgres://s14g09:s14g09_Master@movie.cdnh3cwt5np2.us-east-1.rds.amazonaws.com:5432/s14g09_IMDB_ColorPrediction"

engine = create_engine(db_string)
print(" Database has the following tables: ", engine.table_names())

connection = engine.connect()
metadata = db.MetaData()

movies_table = db.Table('movies', metadata, autoload=True, autoload_with=engine)
colors_table = db.Table('colors', metadata, autoload=True, autoload_with=engine)
faces_table = db.Table('faces', metadata, autoload=True, autoload_with=engine)

# Print the column names
#print(movies_table.columns.keys())
#print(colors_table.columns.keys())
#print(faces_table.columns.keys())

# Print full table metadata
#print(repr(metadata.tables['movies']))
#print(repr(metadata.tables['colors']))
#print(repr(metadata.tables['faces']))

query = db.select([movies_table, colors_table])
query = query.select_from(movies_table.join(colors_table, movies_table.columns.movie_id == colors_table.columns.movie))
results = connection.execute(query).fetchall()
df = pd.DataFrame(results)
df.columns = results[0].keys()
print(df.head(10))

#movies_table = db.execute('SELECT * FROM movies')
#colors_table = engine.execute('SELECT * FROM colors')
#faces_table = engine.execute('SELECT * FROM faces')

#for row in movies_table:
#	print("movie id:", row['movie_id'], "path:", row['images_path'], "score:", row['imdb_score'])
#for row in colors_table:
#	print("color id:", row['color_id'], "movie:", row['movie'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


app.secret_key = "e14a-key"
>>>>>>> ce078ef44e396c917b095f91f065aafd23990cbe

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
<<<<<<< HEAD
	movies_json = {'movies': []}
	movies = Movie.query.all()
	#colors = Color.query.filter_by(movie=movies.movie_id);
	#for color in colors:
	#	color_info = color.__dict__
	#	del color_info['_sa_instance_state']
	#	color_json['color'].append(color_info)
	#print(color_json)
	#return jsonify(color_json)
	for movie in movies:
		movie_info = movie.__dict__
		del movie_info['_sa_instance_state']
		movies_json['movie'].append(movie_info)
	return jsonify(movies_json)
=======
    movies_json = {'movie': []}
    #Todo: Figure out how to pass the data
    return jsonify(movies_json)
>>>>>>> ce078ef44e396c917b095f91f065aafd23990cbe

if __name__ == "__main__":
  app.run(debug=True)