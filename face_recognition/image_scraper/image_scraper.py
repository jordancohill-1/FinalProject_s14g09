#
# Image Scraper
# Scrapes Google Images for actors
# Author: Phillip T.
#

###########
# OPTIONS #
###########

actors_json = 'actors/actors.json'
faces_dir = 'faces'
img_format = 'jpg'
img_limit = 20

######################################################

import json

from google_images_download import google_images_download

# load actors json
with open(actors_json) as json_file:
  actors = json.load(json_file)

# get length of actors
actors_length = len(actors)

# init download lib
response = google_images_download.googleimagesdownload()

# set up image scraper args
arguments = {'keywords': '',
             'output_directory': faces_dir,
             'image_directory': '',
             'limit': img_limit,
             'format': img_format,
             'silent_mode': True}

# process actors
for i, actor in enumerate(actors):
  # set up search arg, image dir name
  arguments['keywords'] = f'{actor["name"]} headshot'
  arguments['image_directory'] = f'{actor["nconst"]}'

  # download images with args
  response.download(arguments)

  # notify user
  print(f'[PROG] {actor["name"]} - {i + 1} of {actors_length} processed')