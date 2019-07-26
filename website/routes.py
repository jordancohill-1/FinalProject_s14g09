from flask import Flask, render_template, request, redirect, url_for
#from models import db, User
#from forms import UsersForm

app = Flask(__name__)

#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/usersdb'
#db.init_app(app)

app.secret_key = "e14a-key"

@app.route("/")
def index():
  return render_template("index.html")

@app.route("/trends")
def trends():
  return render_template("trends.html")

if __name__ == "__main__":
  app.run(debug=True)
