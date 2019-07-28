CREATE TABLE movies(
movie_id serial PRIMARY KEY, 
title VARCHAR(500) not null,
director VARCHAR(100) not null,
critics INT not null,
duration FLOAT not null,
first_actor VARCHAR(100) not null,
second_actor VARCHAR(100) not null,
third_actor VARCHAR(100) not null,
poster_faces INT not null,
dominant_color_rgb VARCHAR(50) not null,
dominant_color_name VARCHAR(50) not null,
link VARCHAR(500) not null,
imdb_score Float not null
 );


