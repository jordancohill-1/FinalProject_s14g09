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

### Facial Recognition (Phillip Tran)

#### Nconst Scraping

Using a simple Node script I was able to extract the `nconst` identifiers of the
top 1000 actors on IMDB. This ensures that we have the most relevant set of
actors to identify trends with.

#### DB Actor Filtering

The next step is to associate these identifiers with the actors.

I imported IMDB's entire [database](https://datasets.imdbws.com/) of actors.
Then, I used a Python script in order to filter the top 1000 actors in the `nconst.json` file I generated using the `nconst_scraper` and spit them out
into a file called `top_1000_actors.csv`.

#### Image Scraping

The actor images are needed as part of the facial recognition dataset. Currently
a WIP.

I need to brush up on async/await so my Node script scrapes the images correctly. It works with 10 to 15 at a time but tends to bug out when it has to more images
at a time due to the way Javascript works.

#### Face Recognition

Also a WIP.

I found the [face_recognition](https://github.com/ageitgey/face_recognition) 
library to be an accurate Python library for facial recognition. It works quite
well with eyewear and partially obscured faces.

Although I can run it fine through the CLI, I'm still working on a script
implementation. [Adrian Rosebrock's article](https://www.pyimagesearch.com/2018/06/18/face-recognition-with-opencv-python-and-deep-learning/)
seems to be a pretty good jumping off point.

I already got the actor image encoding and face recognition to work. The last
order of business is to add the actors that appear in each poster to its
associated database entry.

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

### Facial Detection (Phillip Tran)

With the use of the [face_recognition](https://github.com/ageitgey/face_recognition)
library I created a facial detection script. The script counts the number of
faces in a given movie poster and adds a corresponding entry to the database.

The library uses Dlib's CNN facial recognition model. I've configured it to
upsample each poster in order to find smaller faces.

I ran the script using [Google Colab](https://colab.research.google.com/drive/1VFrcniIjjWdVoouzlqKBsgxjQGazubgT).
This allowed me to process the data using a GPU, which is much quicker than
using my local machine.