from flask import Flask, render_template, request, redirect, url_for, flash
from werkzeug.utils import secure_filename
import upload
#from models import db, User
#from forms import UsersForm

UPLOAD_FOLDER = 'UPLOAD_FOLDER'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)

#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/usersdb'
#db.init_app(app)
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

if __name__ == "__main__":
  app.run(debug=True)
