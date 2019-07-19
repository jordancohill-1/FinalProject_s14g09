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

