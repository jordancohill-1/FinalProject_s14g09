#
# Actor Scraper
# Scrapes actor images, creates json file of actor info
# Author: Phillip T.
#

###########
# OPTIONS #
###########

base_url = 'https://www.imdb.com/name/'
nconsts_file = 'nconsts/nconsts.json'
json_dest = 'actors.json'
img_dest = 'actors'

################################################################################

import urllib.request
import requests
import json

from bs4 import BeautifulSoup
from requests import get
from PIL import Image

# set up actors list
actors = []

# load nconsts file
with open(nconsts_file) as json_file:
  nconsts = json.load(json_file)

# remove duplicates
nconsts = list(set(nconsts))

# find length of nconsts list
nconsts_length = len(nconsts)

# loop through nconsts
for index, nconst in enumerate(nconsts):
  # construct actor URL, filename, and image path
  actor_url = base_url + nconst
  filename = f'{nconst}.jpg'
  img_path = f'{img_dest}/{filename}'
  
  # obtain response from page
  response = get(actor_url)
  
  # parse HTML text
  html = BeautifulSoup(response.text, 'html.parser')
  
  # find actor div
  actor_div = html.find('div', {'id': 'name-overview-widget'})
  
  # extract actor name and image URL
  actor_name = actor_div.h1.span.text
  img_url = actor_div.find('img', {'id': 'name-poster'})['src']
  
  # create actor dictonary and add to actors to list
  actor = { 'nconst': nconst,
            'name': actor_name,
            'filename': filename }
  actors.append(actor)

  # download and store image
  r = requests.get(img_url, stream = True)
  i = Image.open(r.raw)
  i.save(img_path)
  
  # notify user
  print(f'[PROG] {nconst} - {index + 1} of {nconsts_length} actors processed')

# write actor info to json file
with open(json_dest, 'w') as outfile:
  json.dump(actors, outfile)

print('[DONE] All actors processed')