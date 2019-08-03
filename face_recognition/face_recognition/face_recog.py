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

# set up list of face encodings
known_actor_encodings = []
known_actor_nconsts = []

# populate actors path
actors = os.listdir(actors_dir)
actors_paths = [os.path.join(actors_dir, f) for f in actors if f.endswith("jpg")]

# get number of actors
actors_length = len(actors_paths)

# process actor images
for i, path in enumerate(actors_paths):
  # load actor image into numpy array
  actor = face_recognition.load_image_file(path)

  # get face encoding, push to array
  actor = face_recognition.face_encodings(actor)[0]
  known_actor_encodings.append(actor)
  
  # get nconst, push to array
  nconst = path.replace(f'{actors_dir}/', '').replace('.jpg', '')
  known_actor_nconsts.append(nconst)

  # notify user
  print(f'[PROG] {nconst} - {i + 1} of {actors_length} processed')

# populate posters path
posters = os.listdir(posters_dir)
posters_paths = [os.path.join(posters_dir, f) for f in posters if f.endswith("jpg")]

# get number of posters
posters_length = len(posters_paths)

# process poster images
for i, path in enumerate(posters_paths):
  # scale down poster for processing
  poster = cv2.imread(path, 0)
  poster = imutils.resize(poster, height=1000)

  # temporarily write poster to disk
  cv2.imwrite('temp.jpg', poster)

  # load poster
  poster = face_recognition.load_image_file('temp.jpg')

  # find faces and encodings in the poster
  face_locations = face_recognition.face_locations(poster, number_of_times_to_upsample=1, model='cnn')
  face_encodings = face_recognition.face_encodings(poster, face_locations)
  
  # process each face found in poster
  for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
    # find matches for known faces
    matches = face_recognition.compare_faces(known_actor_encodings, face_encoding)
    
    if True in matches:
      first_match_index = matches.index(True)
      name = known_actor_nconsts[first_match_index]
      print(f'{path} - {name}')
    else:
      print(f'{path} - no matches')