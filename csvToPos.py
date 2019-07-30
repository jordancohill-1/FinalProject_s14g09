
import psycopg2
import pandas as pd

conn = psycopg2.connect("host=localhost port=5433 dbname=movie user=postgres")
cur = conn.cursor()


df_colors = pd.read_csv('dominantColors.csv', index_col=0)
for idx, c in df_colors.iterrows():
    print(c.filename, c.dominant_color_rgb, c.dominant_color_name)
    update = """UPDATE movies SET dominant_color_rgb = %s, dominant_color_name = %s  WHERE images_path = %s"""
    cur.execute(update,(c.dominant_color_rgb, c.dominant_color_name, c.filename))
    conn.commit()

cur.close()
conn.close()