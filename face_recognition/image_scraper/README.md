# Image Scraper

## Introduction

Takes actor names from `actors.json` in order to download a maximum of 20
headshots per actor from Google Images.

## Package Requirements

- google_images_download

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
actors_json = 'actors/actors.json'
faces_dir = 'faces'
img_format = 'jpg'
img_limit = 20
```

- `actors_json` - where the actors json file is stored
- `faces_dir` - where the face images are stored
- `img_format` - the format of the image to be saved
- `img_limit` - the max number of images to be scraped per actor