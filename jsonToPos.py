
#Import csv to postgresql db

import psycopg2
import pandas as pd
##psql "host=movie.cdnh3cwt5np2.us-east-1.rds.amazonaws.com port=5432 user=s14g09 password=s14g09_Master dbname=s14g09_IMDB_ColorPrediction sslmode=verify-full sslrootcert=<path>"
#conn = psycopg2.connect("host=localhost port=5432 dbname=movie user=phillip password=")
#conn = psycopg2.connect("host=localhost port=5433 dbname=movie user=postgres")
conn = psycopg2.connect(database='s14g09_IMDB_ColorPrediction', user='s14g09', password="s14g09_Master", host='movie.cdnh3cwt5np2.us-east-1.rds.amazonaws.com', port='5432')
cur = conn.cursor()

cur.execute("DROP TABLE IF EXISTS movies;")

cur.execute('''CREATE TABLE movies (
                     movie_id SERIAL PRIMARY KEY NOT NULL,
                     images_path TEXT NULL,
                     imdb_score TEXT NULL);''')


conn.commit()

df_movies = pd.read_json('imdb_output.json', orient='columns')
df_images = df_movies['images']
#print(df_images[1])
for idx, m in df_movies.iterrows():
    try:
        paths = m['images'][0]['path']
        paths = paths[5:]
    except IndexError:
        paths = " "
    
    print(paths)
    cur.execute('''INSERT INTO movies (images_path, imdb_score) VALUES (%s,%s)''', ( paths,  m.imdb_score))
    conn.commit()

cur.close()
conn.close()



