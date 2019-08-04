#
# Image Scraper
# Scrapes Google Images for actors
# Author: Phillip T.
#

###########
# OPTIONS #
###########

actors_json = 'actors.json'

######################################################

import json

from google_images_download import google_images_download

# load actors json
with open(actors_json) as json_file:
  actors = json.load(json_file)

# init download lib
response = google_images_download.googleimagesdownload()

arguments = {'keywords': '',
             'output_directory': 'faces',
             'image_directory': 'Leonardo DiCaprio',
             'limit': 20,
             'print_urls': True}

arguments['keywords'] = 'Leonardo DiCaprio Headshot'

paths = response.download(arguments)

print(paths)