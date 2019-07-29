
#Import csv to postgresql db

import psycopg2
import pandas as pd

conn = psycopg2.connect("host=localhost port=5433 dbname=movie user=postgres")
cur = conn.cursor()

cur.execute("DROP TABLE IF EXISTS movies;")

cur.execute('''CREATE TABLE movies (
                     movie_id SERIAL PRIMARY KEY NOT NULL,
                     images_path VARCHAR(200) NULL,
                     imdb_score VARCHAR(50)  NULL,
                     dominant_color_rgb VARCHAR(50)  null,
                     dominant_color_name VARCHAR(50)  null
    );''')


conn.commit()

df_movies = pd.read_json('imdb_output.json')
df_images = df_movies['images']
#print(df_images[1])
for idx, m in df_movies.iterrows():
    paths = m['images'][0]['path']
    
    print(paths)
#cur.execute('''INSERT INTO movies (images_path, imdb_score) VALUES (%s,%s)''', ( m['images'][0]['path'],  m.imdb_score))
# conn.commit()

cur.close()
conn.close()