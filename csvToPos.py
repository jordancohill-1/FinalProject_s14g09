
import psycopg2
import pandas as pd


conn = psycopg2.connect("host=localhost port=5433 dbname=movie user=postgres")
cur = conn.cursor()

cur.execute("DROP TABLE IF EXISTS colors;")

cur.execute('''CREATE TABLE colors (
                     color_id SERIAL PRIMARY KEY NOT NULL,
                     movie INT NOT NULL,
                     dominant_color_rgb TEXT NOT NULL,
                     dominant_color_name TEXT NOT NULL,
                     FOREIGN KEY (movie) REFERENCES movies(movie_id)
                     );''')


conn.commit()


df_colors = pd.read_csv('dominantColors.csv', index_col=0)
for idx, c in df_colors.iterrows():
	cur.execute("""(SELECT movie_id FROM movies WHERE images_path = %s)""", (c.filename,))
	mid = cur.fetchone();
	if mid is not None:
		mid =int(mid[0])
		print(mid)
		cur.execute("""INSERT INTO colors ( movie, dominant_color_rgb, dominant_color_name) VALUES (%s,%s,%s)""", ( 
			mid, c.dominant_color_rgb, c.dominant_color_name))
		conn.commit()


cur.close()
conn.close()
