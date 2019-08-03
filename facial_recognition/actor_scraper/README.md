# Face Detection

## Introduction

Script that uses Dlib's CNN face detection to find faces in movie posters.

[Google Colab Link](https://colab.research.google.com/drive/1VFrcniIjjWdVoouzlqKBsgxjQGazubgT)

## Package Requirements

- beautifulsoup4
- pillow

### Install Package Requirements

```
pip install -r requirements.txt
```

## Usage

```
python actor_scraper.py
```

### Options

```
base_url = 'https://www.imdb.com/name/'
nconsts_file = 'nconsts/nconsts.json'
json_dest = 'actors/actors.json'
img_dest = 'images'

```

- `base_url` - the URL from which the actor URL is constructed from
- `nconsts_file` - where the nconsts file is stored
- `json_dest` - where the json file will be written to
- `img_dest` - where the images will be written to
