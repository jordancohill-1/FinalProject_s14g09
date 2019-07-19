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