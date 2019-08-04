import os
import cv2
import json
import imutils
import psycopg2
import numpy as np
import face_recognition

###########
# OPTIONS #
###########

# database
conn = psycopg2.connect("host=localhost port=5432 dbname=movie user=phillip password=LLMMl167")
#conn = psycopg2.connect("host=localhost port=5433 dbname=movie user=postgres")
#conn = psycopg2.connect(database='s14g09_IMDB_ColorPrediction', user='s14g09', password="s14g09_Master", host='movie.cdnh3cwt5np2.us-east-1.rds.amazonaws.com', port='5432')

# posters directory
posters_dir = '../../full'

# actors directory
actors_dir = 'actors'

# actors file
actors_file = 'actors.json'

################################################################################

# connect to DB
cur = conn.cursor()

# get list of face encodings from DB, convert from json to list
cur.execute('SELECT face_encoding from actors')
db_face_encodings = cur.fetchall()
db_face_encodings = list(db_face_encodings)

# set up know face encodings array
known_face_encodings = []

# process all tuple face encodings from db
for i, face_encoding in enumerate(db_face_encodings):
  # turn into properly formatted numpy array
  face_encoding = list(face_encoding[0])
  face_encoding = np.array(face_encoding)
  
  # convert face_encoding to numpy array
  face_encoding = np.array(face_encoding)
  
  # add to known face encodings array
  known_face_encodings.append(face_encoding)

# get list of nconsts from DB
cur.execute('SELECT name from actors')
known_face_names = cur.fetchall()

# populate posters path
posters = os.listdir(posters_dir)
posters_paths = [os.path.join(posters_dir, f) for f in posters if f.endswith("jpg")]

# process poster images
for i, path in enumerate(posters_paths):
    # scale down poster for processing
    poster = cv2.imread(path, 0)
    poster = imutils.resize(poster, height=1000)

    # temporarily write poster to disk
    cv2.imwrite('temp.jpg', poster)

    # load poster
    poster = face_recognition.load_image_file('temp.jpg')

    # find faces in poster
    face_locations = face_recognition.face_locations(poster)
    face_encodings = face_recognition.face_encodings(poster, face_locations, num_jitters=10)

    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
      matches = face_recognition.compare_faces(known_face_encodings, face_encoding)

      face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
      
      best_match_index = np.argmin(face_distances)
      if matches[best_match_index]:
        name = known_face_names[best_match_index][0]
        print(name, path)
      else:
        print(path)