import os
import json
import psycopg2
import pandas as pd
import face_recognition
from PIL import Image

###########
# OPTIONS #
###########

# database
conn = psycopg2.connect("host=localhost port=5432 dbname=movie user=phillip password=")
#conn = psycopg2.connect("host=localhost port=5433 dbname=movie user=postgres")

# images directory
image_dir = "../full"

#############################################################################

# connect to DB
cur = conn.cursor()

# drop existing table, create new table
cur.execute("DROP TABLE IF EXISTS faces;")
cur.execute("""CREATE TABLE faces (
                      face_id SERIAL PRIMARY KEY NOT NULL,
                      movie INT NOT NULL,
                      num_faces INT NOT NULL,
                      FOREIGN KEY (movie) REFERENCES movies(movie_id)
                      );""")
conn.commit()

# populate images path
files = os.listdir(image_dir)
images_paths = [os.path.join(image_dir, f) for f in files if f.endswith("jpg")]

# process image files
for i, path in enumerate(images_paths):
  # load image
  image = face_recognition.load_image_file(path)

  # find faces
  face_locations = face_recognition.face_locations(image, number_of_times_to_upsample=0, model="cnn")

  # store number of faces
  num_faces = len(face_locations)
  
  # extract filename
  filename = path.replace("../full/", "")

  # extract movie id
  cur.execute("""(SELECT movie_id FROM movies WHERE images_path='{}')""".format(filename))

  # store movie id
  mid = int(cur.fetchone()[0])
  
  # print entry info
  print(mid, path)

  # create DB entry
  cur.execute("""INSERT INTO faces (movie, num_faces) VALUES({movie}, {num_faces})""".format(movie=mid,num_faces=num_faces))
  conn.commit()

cur.close()
conn.close()