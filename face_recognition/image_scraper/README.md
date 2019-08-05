# Image Scraper

## Introduction

### Image Scraper

Scrapes image and name from the actors provided in the `nconst.json` file.

### Face Encoding

Generates face encodings from image and creates DB entry with related actor
information.

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

```
python actor_to_db.py
```

### Options

#### Image Scraper

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

#### Face Encoding

```
# database
conn = psycopg2.connect(database='s14g09_IMDB_ColorPrediction', user='s14g09', password="s14g09_Master", host='movie.cdnh3cwt5np2.us-east-1.rds.amazonaws.com', port='5432')

# faces directory
faces_dir = 'faces'

# actors file
actors_file = 'actors.json'
```

- `conn` - connection info for the database
- `faces_dir` - where the actor faces are stored
- `actors_file` - where the actor info is stored 
