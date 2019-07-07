# Process Book

## Implementation Process

### Poster Scraping (Phillip Tran)

Most of the work was cut out for me with the [provided repo](https://github.com/sundeepblue/movie_rating_prediction)
for the project but there were a few roadblocks along the way.

I installed Anaconda to make it easier to deal with Scrapy's dependencies. I came 
across a syntax error having to do with the print function while attempting to run
the scraper and found that the scraper is written in Python 2.7. As a result, I
switched the Anaconda environment to Python 2.7 and installed the necessary
depedencies.

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