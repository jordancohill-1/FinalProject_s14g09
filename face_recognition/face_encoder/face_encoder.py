#
# Face Encoding
# Creates a face encoding for each actor and makes a related DB entry
# Author: Phillip T.
#


import os
import cv2
import json
import imutils
import psycopg2
import face_recognition

###########
# OPTIONS #
###########

# database
#conn = psycopg2.connect("host=localhost port=5432 dbname=movie user=phillip password=")
#conn = psycopg2.connect("host=localhost port=5433 dbname=movie user=postgres")
conn = psycopg2.connect(database='s14g09_IMDB_ColorPrediction', user='s14g09', password="s14g09_Master", host='movie.cdnh3cwt5np2.us-east-1.rds.amazonaws.com', port='5432')

# faces directory
faces_dir = 'faces'

# actors file
actors_file = 'actors/actors.json'

################################################################################

# connect to DB
cur = conn.cursor()

# drop existing table, create new table
cur.execute('DROP TABLE IF EXISTS actors;')
cur.execute("""CREATE TABLE actors (
                      actor_id SERIAL PRIMARY KEY NOT NULL,
                      name TEXT NOT NULL,
                      nconst TEXT NOT NULL,
                      face_filename TEXT NOT NULL,
                      face_encoding JSON NOT NULL
                      )""")
conn.commit()

# load actors file
with open(actors_file) as json_file:
  actors = json.load(json_file)

# populate actors path
faces = os.listdir(faces_dir)
faces_paths = [os.path.join(faces_dir, f) for f in faces if f.endswith("jpg")]

# get number of faces
faces_length = len(faces_paths)

# process actor images
for i, path in enumerate(faces_paths):
  # load actor image into numpy array
  face = face_recognition.load_image_file(path)

  # get face encoding
  encoding = face_recognition.face_encodings(face)

  # continue if encoding returns results
  if 0 < len(encoding):
    # get encoding
    encoding = json.dumps(list(encoding[0]))

    # find corresponding actor in json file
    for k, actor in enumerate(actors):
      if nconst == actor['nconst']:
        # get actor name, nconst, filename
        name = actor['name']
        nconst = actor['nconst']
        filename = actor['filename']

    # create DB entry
    cur.execute("""INSERT INTO actors (name, nconst, face_filename, face_encoding)
                VALUES(%s, %s, %s, %s)""", (name, nconst, filename, encoding))
    conn.commit()

  # notify user
  print(f'[PROG] {nconst} - {i + 1} of {faces_length} processed')

cur.close()
conn.close()
