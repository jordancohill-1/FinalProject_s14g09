# Image Scraper

## Introduction

Scrapes image and name from the actors provided in the `nconst.json` file.

## Package Requirements

- beautifulsoup4
- pillow

### Install Package Requirements

```
pip install -r requirements.txt
```

## Usage

```
python image_scraper.py
```

### Options

```
base_url = 'https://www.imdb.com/name/'
nconsts_file = 'actors/actors.json'
json_dest = 'actors.json'
img_dest = 'faces'

```

- `base_url` - the URL from which the actor URL is constructed from
- `nconsts_file` - where the nconsts file is stored
- `json_dest` - where the json file will be written to
- `img_dest` - where the images will be written to
