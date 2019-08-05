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

################################################################################

# connect to DB
cur = conn.cursor()

# drop existing table, create new table
cur.execute('DROP TABLE IF EXISTS actors_movies;')
cur.execute("""CREATE TABLE actors_movies (
                      actor SERIAL NOT NULL,
                      movie SERIAL NOT NULL,
                      FOREIGN KEY (movie) REFERENCES movies(movie_id),
                      FOREIGN KEY (actor) REFERENCES actors(actor_id)
                      )""")
conn.commit()

# get list of nconsts from DB
cur.execute('SELECT nconst from actors')
known_face_nconsts = cur.fetchall()

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
  
# populate posters path
posters = os.listdir(posters_dir)
posters_paths = [os.path.join(posters_dir, f) for f in posters if f.endswith("jpg")]

# get number of posters
posters_length = len(posters_paths)

# process poster images
for i, path in enumerate(posters_paths):
    # extract filename from path
    filename = path.replace(f'{posters_dir}/', "")
  
    # find movie_id via filename
    cur.execute("""SELECT movie_id from movies WHERE images_path = '{}'""".format(filename))
    
    # store query
    movie_id = cur.fetchone()
    
    # run if query gives a result
    if movie_id is not None:
      # extract movie id
      movie_id = movie_id[0]
  
      # scale down poster for processing
      poster = cv2.imread(path, 0)
      poster = imutils.resize(poster, height=1000)

      # temporarily write poster to disk
      cv2.imwrite('temp.jpg', poster)

      # load poster
      poster = face_recognition.load_image_file('temp.jpg')

      # find faces in poster
      face_locations = face_recognition.face_locations(poster)
      face_encodings = face_recognition.face_encodings(poster, face_locations, num_jitters=100)

      # process each face found
      for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        # find possible matches
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)

        # get euclidean distance for the face
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
      
        # find known face with smallest distance
        best_match_index = np.argmin(face_distances)
        if matches[best_match_index]:
          # associate known face with nconst
          nconst = known_face_nconsts[best_match_index][0]
        
          # find actor ID via nconst and extract value
          cur.execute("""SELECT actor_id from actors WHERE nconst = '{}'""".format(nconst))
          actor_id = cur.fetchone()
          actor_id = actor_id[0]
        
          # create DB entry
          cur.execute("""INSERT INTO actors_movies (actor, movie)
                      VALUES({}, {})""".format(actor_id, movie_id))
          conn.commit()
        
          # notify user
          print(f'[PROG] {nconst} found in {filename}')
    
    # notify user
    print(f'[PROG] {i + 1} of {posters_length} processed')
