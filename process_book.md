# Process Book

## Implementation Process

### Poster Scraping (Phillip Tran)

Most of the work was cut out for me with the [provided repo](https://github.com/sundeepblue/movie_rating_prediction)
for the project but there were a few roadblocks along the way.

I installed Anaconda to make it easier to deal with Scrapy's dependencies. After
isntalling dependendies, I came across a syntax error having to do with the 
`print` function while attempting to run the scraper. I figured out that the
scraper was written in Python 2.7. As a result, I switched the Anaconda
environment to Python 2.7 and installed the necessary depedencies once more.

After attempting to run the script again, I found that Scrapy wasn't detecting
the `movie.settings` module. The [solution](https://stackoverflow.com/a/24576949) 
was to create a dummy project to copy the related scrapy files into:

```
scrappy startproject movie
```

Upon executing the script, I discovered that Scrapy wasn't able to write to my
disk because the `IMAGES_STORE` variable in `settings.py` was pointed to a
directory that didn't exist. After changing the variable to my desired
directory, I was able to run the script and scrape ~5000 images totaling
1.4GB.

These images will be used to train and test our model.

### Quantization (Jordan Cohill)

With the help of OpenCV and a script example from 
https://www.pyimagesearch.com/2014/07/07/color-quantization-opencv-using-k-means-clustering/ 
I was able to generate quantized images for all the given movie posters.

The original images were stored locally and the script I wrote looped thru the directory
of the images and generated a quantized image for each file. The quantized images were 
created using the 4 dominant colors of each poster.

Next, I plan to extract the dominant colors from the quantized images so that we can make 
predictions on what colors lead to better ratings/or sales.

### Dominant Colors (Jordan Cohill)
Using the results of the quantized images, the dominant color of each image was
evaluated using the ColorThief library, which returns an RGB value for each image.
Next, the RGB value was evaluated using the WebColors library and some additional 
script to determine the closest associated color name.

The images filename, RGB value and Color name were stored in an np.array and 
written to a csv.

The Next step will be to group the colors at a higher level(primary colors) and compare 
those colors with movie ratings to show which dominant color leads to better movie ratings

#### Color Categorization (Phillip Tran)

I improved upon Jordan's work by modifying his color categorization function.
Originally, the script assigns the closest associated CSS3 color name to the
dominant color. However, this would produce a list of approximately 140
different colors. This would make it difficult to find broad trends in our data.

The script now takes the CSS3 color name and recategorizes it based upon 11
general colors:

- Pink
- Red
- Orange
- Yellow
- Brown
- Green
- Blue
- Purple
- White
- Gray
- Black

### Facial Detection (Phillip Tran)

With the use of the [face_recognition](https://github.com/ageitgey/face_recognition)
library I created a facial detection script. The script counts the number of
faces in a given movie poster and adds a corresponding entry to the database.

The library uses Dlib's CNN facial recognition model. I've configured it to
upsample each poster twice in order to find smaller faces.

I ran the script using [Google Colab](https://colab.research.google.com/drive/1VFrcniIjjWdVoouzlqKBsgxjQGazubgT).
This allowed me to process the data using a GPU, which is much quicker than
using my local machine.

After running it through Colab, I discovered that I ran out of vRAM about 1000
images in. To deal with this I downscaled each image to 1000px in height
(preserving aspect ratio) and configured the library to upscale the image twice.

With this change I was able to process all of the data without coming across
hardware limits while maintaining similar accuracy.

### Facial Recognition (Phillip Tran)

#### Actor Scraping

Using a Node script I was able to extract the nconst identifiers and names of
the [top 100 actors on IMDB](https://www.imdb.com/list/ls000972065/).
This ensures that we have the most relevant set of actors to identify trends
with. The extracted information is written to `actors.json`.

I originally planned to use the [top 1000 actors on IMDB](https://www.imdb.com/list/ls058011111/)
but I was getting far too many false identifications while running my facial
recognition. By reducing the number of faces that must be identified, I make it
easier for the facial recognition to make a correct guess.

I had originally planned to write the majority of my data scraping and
processing components in Node but I soon found that Python was a much more
comfortable environment for me.

#### Image Scraping

A simple python script takes each actor in `actors.json`, downloads their image
from IMDB, and adds relevant information (filename) to a new `actors.json` file.
I leveraged the BeautifulSoup library for webcrawling and the Pillow library for
downloading the image.

#### Face Encoder

This python script processed each of the face images using the
[face_recognition](https://github.com/ageitgey/face_recognition) library, which
leverages dlib's face recongition. It creates a encoding, or a 128-dimensional vector, that represents each actor's face. After processing each face, a
database entry containing the encoding and related actor information is made.

To make the encoder more accurate, I applied an option called `num_jitter=100`.
This makes dlib randomly distort the image 100 times, encode each version, and
take the average result of the collective encodings. The only downside to this
is it takes longer to process each face. By leveraging Google Collab, however,
processing these images was relatively speedy.

#### Face Recognition

I used the [face_recognition](https://github.com/ageitgey/face_recognition)
library for my facial recognition component. It a popular Python library, comes
pretrained, and is fairly accurate provided that you tweak the parameters.

The script gets a list of actors and their face encodings from the database and
processes each poster for faces. First, it identifies where faces are located in
the poster in the same fashion as the face detection script. Then, it generates
an encoding of each face and compares it to known faces in the database to find
matches. Once it finds potential matches, the euclidian distance of each of the
potential matches to the unkown face is compared. The face with the smallest
distance is then selected as the best match. Finally, a database entry
associating the matching actor to the movie is generated.

A curious issue I noticed with the library is that it often mistakes children
for a known face. By setting the `tolerance` option to `0.5` from the default
`0.6` on the `compare_faces` function, I was able to reduce these false
positives.

### Flask App

#### UI Design (Phillip Tran)

I primarily used [Boostrap](https://getbootstrap.com/) as a base and made
modifications to mold my own asthetic. I leveraged a number of additional
libraries in order to build the front-end of the site.

##### Color Scheme

I selected colors from the [Tailwind.css](https://tailwindcss.com/docs/customizing-colors/#default-color-palette)
color pallette. I'm a fan of its vibrant, friendly, well-balanced colors.

- White: `#F7FAFC`
- Black: `#2D3748`
- Primary: `#4FD1C5`

##### Navbar

I added a teal border at the top of the navbar. It spices up an otherwise
ordinary navbar.

To achieve the underline effect upon hovering over menu items, I used a snippet
from the [Hover.css](https://ianlunn.github.io/Hover/) library. I gave the
animation a nice snappy cubic bezier curve.

##### Page Trasitions

I used the [Swup](https://github.com/swup/swup) library for my page trasitions.
I particularly like this library because it makes loading and ordinary web page
feel like interacting with a native application.

The transition consists of a snappy fade animation with a translation along the
Y axis.

I discovered that the navbar menu on mobile devices would not close when swup
transitions to a new page. To combat this, I wrote a small Javascript snippet to
close the navbar menu, if open, when swup initiates the transition animation.


#### Storing Data with Postgres (Jordan Cohill)

Using the psycopg2 library a connection to the local database was established 
and the Movies table was created. Next, the Pandas library was user to connect 
to a local json file, utilizing Pandas read_json. The file was iterrated and 
populated the Movies table with the movie path and it's IMDB rating. More data 
can be added should it be needed.

Lastly, the output from the dominant colors process was loaded to the Colors
table by repeating the psycopg2 steps above and then using Pandas read_csv.
Linking these tables is still in process but will be done by adding a foreign 
key to the Colors table that references the unique ID from the movies table.

An AWS RDS instance was created to host our sites data.

#### Upload (Jordan Cohill, Phillip Tran)

Two scripts were written in order to take in a users movie poster and predict 
it's IMDB score. processUpload.py handled resizing, quantizing identifying the 
images dominant color, finding faces, and identifying actors. testTrain.py
utilized SkLearn's test_train_split to create a test and train algorithm and
predict the movie's IMDB score.

The user is then redirected to a results page, giving the user information about
the poster.

#### Creating Visualizations (Samer Maaliki)

Four visualizatiosn were developed to showcase teh results of this project.  
The first is a combination of the numbers of files that were analyzed, the 
number of colors that were extracted from the files and a barchart that shows 
the number of files that had the color as a dominant color.  The next chart 
shows the relationship between the dominant color in an image and the IMDB score.
The third plot shows the effects of the number of faces in a poster on the 
IMDB score.  The final one is a scatterplot that combines all the data.  
It shows the effects of number of faces and the dominant color on the IMDB score. 



